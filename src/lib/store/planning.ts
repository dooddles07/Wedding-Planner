"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BudgetItem, Guest, Task, WeddingStyleId } from "@/types";
import { storage } from "@/lib/data/storage";
import { buildBudget, type PlanningLevel } from "@/lib/budget";
import { seedTasks } from "@/content/tasks";
import { track } from "@/lib/analytics";

/**
 * Everything the couple has entered, in one store.
 *
 * Persisted to localStorage through the same adapter as saves, so the whole
 * product works without an account. Swapping in a backend means changing
 * `storage` — no component touches persistence directly.
 */
export interface PlanningState {
  hydrated: boolean;
  setHydrated: () => void;

  /* The wedding itself */
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string | null;
  location: string;
  guestCount: number;
  styleId: WeddingStyleId | null;
  planningLevel: PlanningLevel;
  setWedding: (patch: Partial<Omit<PlanningState, "setWedding">>) => void;

  /* Budget */
  budgetTotal: number;
  budgetItems: BudgetItem[];
  rebuildBudget: () => void;
  setAllocated: (category: string, value: number) => void;
  setSpent: (category: string, value: number) => void;

  /* Tasks */
  tasks: Task[];
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;

  /* Guests */
  guests: Guest[];
  addGuest: (guest: Omit<Guest, "id">) => void;
  updateGuest: (id: string, patch: Partial<Guest>) => void;
  removeGuest: (id: string) => void;

  reset: () => void;
}

function id() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Twelve months out, which is where most couples actually are. */
function defaultDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

const initial = {
  partnerOne: "",
  partnerTwo: "",
  weddingDate: defaultDate(),
  location: "East of England",
  guestCount: 90,
  styleId: null as WeddingStyleId | null,
  planningLevel: "partial" as PlanningLevel,
  budgetTotal: 45000,
  guests: [] as Guest[],
};

export const usePlanning = create<PlanningState>()(
  persist(
    (set, get) => ({
      ...initial,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      budgetItems: buildBudget({
        total: initial.budgetTotal,
        guestCount: initial.guestCount,
        location: initial.location,
        styleId: initial.styleId,
        planningLevel: initial.planningLevel,
      }),

      tasks: seedTasks(),

      setWedding: (patch) => {
        set(patch as Partial<PlanningState>);
        // Anything that changes the shape of the budget rebuilds it, keeping
        // whatever the couple has already overridden.
        if (
          "guestCount" in patch ||
          "location" in patch ||
          "styleId" in patch ||
          "planningLevel" in patch ||
          "budgetTotal" in patch
        ) {
          get().rebuildBudget();
        }
      },

      rebuildBudget: () => {
        const state = get();
        const next = buildBudget({
          total: state.budgetTotal,
          guestCount: state.guestCount,
          location: state.location,
          styleId: state.styleId,
          planningLevel: state.planningLevel,
        });

        // Spend is the couple’s own record — never recalculated away.
        const spendByCategory = new Map(
          state.budgetItems.map((item) => [item.category, item.spent]),
        );

        set({
          budgetItems: next.map((item) => ({
            ...item,
            spent: spendByCategory.get(item.category) ?? 0,
          })),
        });

        track({
          name: "budget_planner_used",
          total: state.budgetTotal,
          guests: state.guestCount,
        });
      },

      setAllocated: (category, value) =>
        set({
          budgetItems: get().budgetItems.map((item) =>
            item.category === category ? { ...item, allocated: Math.max(0, value) } : item,
          ),
        }),

      setSpent: (category, value) =>
        set({
          budgetItems: get().budgetItems.map((item) =>
            item.category === category ? { ...item, spent: Math.max(0, value) } : item,
          ),
        }),

      toggleTask: (taskId) => {
        const task = get().tasks.find((item) => item.id === taskId);
        if (task && !task.done) track({ name: "checklist_task_completed", taskId });
        set({
          tasks: get().tasks.map((item) =>
            item.id === taskId ? { ...item, done: !item.done } : item,
          ),
        });
      },

      addTask: (task) => set({ tasks: [{ ...task, id: id() }, ...get().tasks] }),

      updateTask: (taskId, patch) =>
        set({
          tasks: get().tasks.map((item) =>
            item.id === taskId ? { ...item, ...patch } : item,
          ),
        }),

      removeTask: (taskId) =>
        set({ tasks: get().tasks.filter((item) => item.id !== taskId) }),

      addGuest: (guest) => set({ guests: [...get().guests, { ...guest, id: id() }] }),

      updateGuest: (guestId, patch) =>
        set({
          guests: get().guests.map((item) =>
            item.id === guestId ? { ...item, ...patch } : item,
          ),
        }),

      removeGuest: (guestId) =>
        set({ guests: get().guests.filter((item) => item.id !== guestId) }),

      reset: () => {
        set({
          ...initial,
          tasks: seedTasks(),
          budgetItems: buildBudget({
            total: initial.budgetTotal,
            guestCount: initial.guestCount,
            location: initial.location,
            styleId: initial.styleId,
            planningLevel: initial.planningLevel,
          }),
        });
      },
    }),
    {
      name: "planning",
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
