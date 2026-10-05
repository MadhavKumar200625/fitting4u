"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Ananya Rao (dummy)",
    detail: "Custom blouse stitching · Indiranagar",
    date: "August 2026",
    rating: 5,
    quote:
      "The boutique understood the fit I wanted from the first trial. The finishing around the neckline was especially neat, and the blouse was ready when promised.",
  },
  {
    name: "Meera Krishnan (dummy)",
    detail: "Fabric shopping · Bengaluru",
    date: "July 2026",
    rating: 5,
    quote:
      "I could compare the fabric details before visiting, which made choosing much easier. The colour and texture were just as described.",
  },
  {
    name: "Kavya Nair (dummy)",
    detail: "Home measurement · Whitefield",
    date: "July 2026",
    rating: 5,
    quote:
      "Having measurements taken at home saved me a trip across the city. The appointment was punctual and the measurements were checked carefully.",
  },
  {
    name: "Priya Sharma (dummy)",
    detail: "Boutique discovery · Jayanagar",
    date: "June 2026",
    rating: 4,
    quote:
      "Found a lovely designer studio nearby for a family function outfit. The team was patient while I looked through different styles and fabrics.",
  },
  {
    name: "Divya Menon (dummy)",
    detail: "Dress material · Bengaluru",
    date: "June 2026",
    rating: 5,
    quote:
      "The fabric arrived well packed and the weave feels lovely in person. I appreciated having clear care details before placing the order.",
  },
  {
    name: "Sneha Iyer (dummy)",
    detail: "Alterations · Malleshwaram",
    date: "May 2026",
    rating: 5,
    quote:
      "My alterations were handled with a lot of care. The fit is comfortable, and the small adjustments I asked for were all taken into account.",
  },
  {
    name: "Aditi Kulkarni (dummy)",
    detail: "Boutique pickup · Koramangala",
    date: "May 2026",
    rating: 4,
    quote:
      "Pickup was straightforward and the boutique called when my order was ready. It was helpful to have the location and contact details in one place.",
  },
  {
    name: "Lakshmi Reddy (dummy)",
    detail: "Saree blouse stitching · HSR Layout",
    date: "April 2026",
    rating: 5,
    quote:
      "The sleeve and shoulder fit came out beautifully. I had a specific design reference and the tailor translated it into a very wearable blouse.",
  },
  {
    name: "Ishita Desai (dummy)",
    detail: "Fabric order · Bengaluru",
    date: "April 2026",
    rating: 5,
    quote:
      "Ordering was simple, and I liked being able to choose a nearby boutique for collection. The fabric was folded carefully and arrived in great condition.",
  },
  {
    name: "Pooja Shetty (dummy)",
    detail: "Designer boutique · Rajajinagar",
    date: "March 2026",
    rating: 5,
    quote:
      "I found a boutique that matched the style I had in mind without spending the day calling around. The team there made the whole visit feel easy.",
  },
];

export default function ReviewsSection() {
  return (
    <section className="border-y border-[#eadde0] bg-[#fff8f8] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <motion.div
          className="mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#a84c63]">
            The fitting-room notes
          </p>
          <h2 className="text-3xl font-bold text-[#30252a] sm:text-4xl">
            Thoughtful details make all the difference
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#685b60]">
            A few kind words about finding fabrics, boutiques and a better fit.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 3) * 0.07 }}
              className="flex min-w-0 flex-col border border-[#eadde0] bg-white p-5 sm:p-6"
            >
              <div className="mb-4 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }, (_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={15}
                    aria-hidden="true"
                    className="fill-[#c16a45] text-[#c16a45]"
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-[15px] leading-7 text-[#40373a]">
                “{review.quote}”
              </blockquote>
              <footer className="mt-6 border-t border-[#f0e8ea] pt-4">
                <p className="font-semibold text-[#30252a]">{review.name}</p>
                <p className="mt-1 text-xs leading-5 text-[#76696e]">
                  {review.detail} <span aria-hidden="true">·</span> {review.date}
                </p>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}