import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getProductBySlug,
  getProducts,
} from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductGallery } from "@/components/ProductGallery";
import { PriceDisplay } from "@/components/PriceDisplay";
import { Rating } from "@/components/Rating";
import { BookingForm } from "@/components/BookingForm";
import { ReviewForm } from "@/components/ReviewForm";
import { WishlistButton } from "@/components/WishlistButton";
import { buttonClasses } from "@/components/Button";
import { getStockState } from "@/types/product";
import { getReviewsForProduct, getUserReviewForProduct } from "@/lib/reviews";
import { isProductWishlisted } from "@/lib/wishlist";
import { auth } from "@/auth";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(
  props: PageProps<"/products/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;

  const category = await getCategoryBySlug(slug);
  if (category) {
    const description = `Shop ${category.name} for kids at TBN Store.`;
    return {
      title: category.name,
      description,
      openGraph: { title: category.name, description, type: "website" },
      twitter: { card: "summary", title: category.name, description },
    };
  }

  const product = await getProductBySlug(slug);
  if (product) {
    const image = product.images[0]?.url;
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        type: "website",
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title: product.name,
        description: product.description,
        images: image ? [image] : undefined,
      },
    };
  }

  return {};
}

export default async function ProductOrCategoryPage(
  props: PageProps<"/products/[slug]">
) {
  const { slug } = await props.params;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const category = await getCategoryBySlug(slug);
  if (category) {
    const products = await getProducts({ categorySlug: category.slug });
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
          <p className="text-sm text-foreground/60">{dict.products.resultCount(products.length)}</p>
        </div>
        <ProductGrid products={products} dict={dict} />
      </div>
    );
  }

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const stockState = getStockState(product.stock);
  const stockLabel = {
    "in-stock": { text: dict.product.inStock, className: "text-emerald-700" },
    "low-stock": { text: dict.product.lowStock, className: "text-amber-700" },
    "out-of-stock": { text: dict.product.outOfStock, className: "text-foreground/50" },
  };
  const stock = stockLabel[stockState];
  const session = await auth();

  const [reviews, userReview, wishlisted] = await Promise.all([
    getReviewsForProduct(product.id),
    session?.user ? getUserReviewForProduct(product.id, session.user.id) : null,
    session?.user ? isProductWishlisted(session.user.id, product.id) : false,
  ]);

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <ProductGallery images={product.images} />

      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-foreground/50">
              {product.brand}
            </span>
            <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
            {product.avgRating != null && (
              <Rating value={product.avgRating} reviewCount={product.reviewCount} />
            )}
          </div>
          <WishlistButton
            productId={product.id}
            initialSaved={wishlisted}
            isLoggedIn={!!session?.user}
            callbackUrl={`/products/${product.slug}`}
            dict={dict.product}
          />
        </div>

        <PriceDisplay price={product.price} salePrice={product.salePrice} size="lg" />

        <p className={`text-sm font-medium ${stock.className}`}>{stock.text}</p>

        <p className="text-sm leading-relaxed text-foreground/70">
          {product.description}
        </p>

        {product.sizes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-foreground/50">{dict.product.availableSizes}</span>
            {product.sizes.map((size) => (
              <span
                key={size}
                className="rounded-full border border-border-subtle px-3 py-1 text-xs font-medium"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {session?.user ? (
          <BookingForm
            productId={product.id}
            sizes={product.sizes}
            defaultName={session.user.name ?? undefined}
            defaultEmail={session.user.email ?? undefined}
            dict={{
              bookThisProduct: dict.booking.bookThisProduct,
              size: dict.booking.size,
              selectSize: dict.booking.selectSize,
              fullName: dict.booking.fullName,
              contactNumber: dict.booking.contactNumber,
              email: dict.booking.email,
              address: dict.booking.address,
              shopName: dict.booking.shopName,
              submit: dict.booking.submit,
              submitting: dict.booking.submitting,
              privacyPrefix: dict.booking.privacyPrefix,
              privacyLinkLabel: dict.booking.privacyLinkLabel,
            }}
            productDict={dict.product}
            optionalLabel={dict.common.optional}
          />
        ) : (
          <div className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-4">
            <p className="text-sm text-foreground/70">{dict.booking.signInPrompt}</p>
            <Link
              href={`/login?callbackUrl=/products/${product.slug}`}
              className={buttonClasses("primary", "lg")}
            >
              {dict.booking.signInCta}
            </Link>
          </div>
        )}

        <dl className="grid grid-cols-2 gap-3 border-t border-border-subtle pt-5 text-sm">
          <div>
            <dt className="text-foreground/50">{dict.product.sku}</dt>
            <dd>{product.sku}</dd>
          </div>
          <div>
            <dt className="text-foreground/50">{dict.product.category}</dt>
            <dd>{product.category.name}</dd>
          </div>
        </dl>
      </div>

      <div className="col-span-full flex flex-col gap-6 border-t border-border-subtle pt-8">
        <h2 className="text-xl font-semibold tracking-tight">{dict.reviews.heading}</h2>

        {session?.user ? (
          <ReviewForm
            productId={product.id}
            defaultRating={userReview?.rating}
            defaultComment={userReview?.comment}
            rateLabels={[
              dict.reviews.rateStars(1),
              dict.reviews.rateStars(2),
              dict.reviews.rateStars(3),
              dict.reviews.rateStars(4),
              dict.reviews.rateStars(5),
            ]}
            dict={{
              yourRating: dict.reviews.yourRating,
              rateThis: dict.reviews.rateThis,
              comment: dict.reviews.comment,
              submit: dict.reviews.submit,
              update: dict.reviews.update,
              saving: dict.reviews.saving,
            }}
          />
        ) : (
          <div className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-4">
            <p className="text-sm text-foreground/70">{dict.reviews.signInPrompt}</p>
            <Link
              href={`/login?callbackUrl=/products/${product.slug}`}
              className={buttonClasses("secondary", "md")}
            >
              {dict.reviews.signInCta}
            </Link>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-foreground/60">{dict.reviews.noReviewsYet}</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border-subtle">
            {reviews.map((review) => (
              <li key={review.id} className="flex flex-col gap-1.5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">{review.user.name}</span>
                  <span className="text-xs text-foreground/50">
                    {review.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <Rating value={review.rating} />
                {review.comment && (
                  <p className="text-sm text-foreground/70">{review.comment}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
