import ProductClientSection from "./ProductClientSection";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <div>
      <ProductClientSection id={id} />
    </div>
  );
}