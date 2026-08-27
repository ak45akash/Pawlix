"use client";

import { findProduct } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";

export default function ReviewsPage() {
  const { state, saveReview } = useDemo();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
      <div className="mt-6 space-y-4">
        {state.reviews.map((review) => (
          <div key={review.id} className="rounded-lg border border-border bg-surface p-4">
            <p className="font-medium">
              {review.author} · {review.rating}/5
            </p>
            <p className="text-sm text-ink-muted">{findProduct(state, review.productId)?.name}</p>
            <p className="mt-2 text-sm">{review.body}</p>
            <button
              className="mt-3 text-sm text-accent"
              onClick={() => saveReview({ ...review, published: !review.published })}
            >
              {review.published ? "Unpublish" : "Publish"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
