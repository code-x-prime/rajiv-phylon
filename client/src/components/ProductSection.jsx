"use client";

import { SectionWrapper, SectionHeading, ProductCard, Container } from "@/components/ui";

export function ProductSection({ title, products }) {
  if (!products?.length) return null;

  return (
    <SectionWrapper>
      <Container>
        <SectionHeading>{title}</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
