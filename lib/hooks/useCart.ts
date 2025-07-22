import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, type Cart } from '../services/cartService';
import { toast } from 'react-hot-toast';

// Query keys for cart operations
const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: cartKeys.detail(),
    queryFn: cartService.getCart,
    staleTime: 1000 * 60 * 5, // Cart data stays fresh for 5 minutes
  });

  const addToCart = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.addToCart(productId, quantity),
    onSuccess: (newCart) => {
      queryClient.setQueryData(cartKeys.detail(), newCart);
      toast.success('Item added to cart');
    },
    onError: () => {
      toast.error('Failed to add item to cart');
    },
  });

  const updateCartItem = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateCartItem(productId, quantity),
    onSuccess: (newCart) => {
      queryClient.setQueryData(cartKeys.detail(), newCart);
      toast.success('Cart updated');
    },
    onError: () => {
      toast.error('Failed to update cart');
    },
  });

  const removeFromCart = useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: (newCart) => {
      queryClient.setQueryData(cartKeys.detail(), newCart);
      toast.success('Item removed from cart');
    },
    onError: () => {
      toast.error('Failed to remove item from cart');
    },
  });

  const clearCart = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.setQueryData(cartKeys.detail(), { items: [], total: 0, totalItems: 0 });
      toast.success('Cart cleared');
    },
    onError: () => {
      toast.error('Failed to clear cart');
    },
  });

  return {
    cart,
    isLoading,
    addToCart: addToCart.mutate,
    updateCartItem: updateCartItem.mutate,
    removeFromCart: removeFromCart.mutate,
    clearCart: clearCart.mutate,
    isAddingToCart: addToCart.isPending,
    isUpdatingCart: updateCartItem.isPending,
    isRemovingFromCart: removeFromCart.isPending,
    isClearingCart: clearCart.isPending,
  };
}
