import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReviewResponse } from "@/types";

interface ReviewState {
  code: string;
  language: string;
  review: ReviewResponse | null;
  isLoading: boolean;
  setCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  setReview: (review: ReviewResponse | null) => void;
  setLoading: (v: boolean) => void;
  reset: () => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      code: "// Paste your code here...",
      language: "javascript",
      review: null,
      isLoading: false,
      setCode: (code) => set({ code }),
      setLanguage: (language) => set({ language }),
      setReview: (review) => set({ review }),
      setLoading: (isLoading) => set({ isLoading }),
      reset: () => set({ code: "// Write or paste your new code here...", review: null }),
    }),
    {
      name: "codesense-review",
      partialize: (s) => ({ code: s.code, language: s.language, review: s.review }),
    }
  )
);
