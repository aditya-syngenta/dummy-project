# ShopEasy – Dummy E-commerce Website

A lightweight, single-page-app-style e-commerce demo built with plain HTML, CSS and vanilla JavaScript.  
No framework, no build step – open `index.html` directly in a browser or serve the folder with any static server.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home page – product grid with category filters and search |
| `product.html` | Product detail page (loaded via `?id=<n>`) |
| `cart.html` | Shopping cart with quantity controls and coupon codes |
| `checkout.html` | Shipping + payment form with validation |
| `success.html` | Order-confirmed landing page |

## Quick Start

```bash
# Option A – Python built-in server
python3 -m http.server 8080
# then open http://localhost:8080

# Option B – Node.js (npx)
npx serve .
```

## Coupon Codes

| Code | Discount |
|------|----------|
| `SAVE10` | 10% off subtotal |
| `SAVE20` | 20% off subtotal |
| `HALFOFF` | 50% off subtotal |

> **Note:** codes are case-sensitive in the current implementation.

## Known Bugs (intentional – for testing)

The following bugs are deliberately left in `app.js` and are marked with `// BUG:` comments:

1. **Cart badge count** – `cartItemCount()` returns the number of *distinct* product lines, not the total quantity of items.
2. **Subtotal truncation** – `cartSubtotal()` uses `parseInt()` which truncates cents (e.g. \$79.99 × 2 shows as \$159 instead of \$159.98).
3. **Negative cart quantity** – the "−" button in the cart does not clamp at 1, allowing qty to reach 0 or negative values.
4. **Coupon case-sensitivity** – `applyCoupon()` does not call `.toUpperCase()`, so `save10` fails even though the UI hint calls codes case-insensitive.
5. **Case-sensitive search** – `searchProducts()` uses `.includes()` without `.toLowerCase()`, so `"headphones"` won't match `"Headphones"`.
6. **Permissive email regex** – checkout validation accepts `user@` or `a@b` as valid email addresses.
7. **ZIP code validation** – only accepts US 5-digit format; rejects valid international postal codes.
8. **No Luhn check on card** – card validation only checks that the number is 16 digits long.
9. **Discount calculation floored** – `discountPercent()` uses `Math.floor` instead of `Math.round`, making displayed savings slightly lower than actual.
10. **No quantity guard on Add-to-Cart** – product detail page does not validate that the qty input is > 0 before adding to cart.
