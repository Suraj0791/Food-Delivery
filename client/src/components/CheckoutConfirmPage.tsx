import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { CheckoutSessionRequest } from "@/types/orderType";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const CheckoutConfirmPage = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const { cart } = useCartStore();
  const { createCheckoutSession, loading } = useOrderStore();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const checkoutHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const restaurantId = cart[0]?.restaurantId;
      if (!restaurantId) {
        console.error("Restaurant ID is missing in cart items!");
        return;
      }

      const checkoutData: CheckoutSessionRequest = {
        cartItems: cart.map((cartItem) => ({
          menuId: cartItem._id,
          name: cartItem.name,
          image: cartItem.image,
          price: cartItem.price.toString(),
          quantity: cartItem.quantity.toString(),
        })),
        deliveryDetails: input,
        restaurantId,
      };

      console.log("checkoutData", checkoutData);
      await createCheckoutSession(checkoutData);
      setOpen(false);
      navigate("/order/status");
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">Review Your Order</DialogTitle>
          <DialogDescription className="text-xs">
            Double-check your delivery details and ensure everything is in order. When you are ready, hit confirm button to finalize your order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={checkoutHandler} className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0">
          <div>
            <Label>Full Name</Label>
            <Input type="text" name="name" value={input.name} onChange={changeEventHandler} placeholder="Enter your full name" required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="Enter your email" required />
          </div>
          <div>
            <Label>Contact</Label>
            <Input type="text" name="contact" value={input.contact} onChange={changeEventHandler} placeholder="Enter your contact number" required />
          </div>
          <div>
            <Label>Address</Label>
            <Input type="text" name="address" value={input.address} onChange={changeEventHandler} placeholder="Enter your address" required />
          </div>
          <div>
            <Label>City</Label>
            <Input type="text" name="city" value={input.city} onChange={changeEventHandler} placeholder="Enter your city" required />
          </div>
          <div>
            <Label>State</Label>
            <Input type="text" name="state" value={input.state} onChange={changeEventHandler} placeholder="Enter your state" required />
          </div>
          <div>
            <Label>Zip Code</Label>
            <Input type="text" name="zipCode" value={input.zipCode} onChange={changeEventHandler} placeholder="Enter your zip code" required />
          </div>
          <div>
            <Label>Country</Label>
            <Input type="text" name="country" value={input.country} onChange={changeEventHandler} placeholder="Enter your country" required />
          </div>
          <DialogFooter className="mt-5">
            <Button type="submit" className="bg-orange hover:bg-hoverOrange" disabled={loading}>
              {loading ? "Processing..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutConfirmPage;