import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CashOutDialog = ({ onCashOut, maxAmount }: { onCashOut: (amount: number) => void, maxAmount: number }) => {
  const [amount, setAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("183490283402834");
  const [expiryDate, setExpiryDate] = useState("02/31");
  const [cvv, setCvv] = useState("987");
  const [cryptoAddress, setCryptoAddress] = useState("0x149a73092402834");
  const [selectedCrypto, setSelectedCrypto] = useState("eth");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, close: () => void) => {
    onCashOut(Number(amount));
    // Reset form
    setAmount("");
    // setCardNumber("");
    // setCryptoAddress("");
    // setSelectedCrypto("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-red-500 hover:text-black transition-colors"
        >
          Cash Out
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Cash Out</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose your preferred withdrawal method.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-200">Amount to Withdraw ($)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              max={maxAmount}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
            <p className="text-sm text-gray-400">Available: ${maxAmount}</p>
          </div>

          <RadioGroup
            value={withdrawMethod}
            onValueChange={setWithdrawMethod}
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor="w-credit"
              className="flex items-center gap-2 text-gray-200 border border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <RadioGroupItem value="credit" id="w-credit" />
              <CreditCard className="w-4 h-4" />
              Credit Card
            </Label>
            <Label
              htmlFor="w-crypto"
              className="flex items-center gap-2 text-gray-200 border border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <RadioGroupItem value="crypto" id="w-crypto" />
              <Wallet className="w-4 h-4" />
              Crypto
            </Label>
          </RadioGroup>

          {withdrawMethod === "credit" ? (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-200">Card Number</Label>
                <Input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-200">Expiry Date</Label>
                  <Input
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-200">CVV</Label>
                  <Input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    type="password"
                    maxLength={3}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-200">Select Cryptocurrency</Label>
                <Select
                  value={selectedCrypto}
                  onValueChange={setSelectedCrypto}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                    <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-200">Wallet Address</Label>
                <Input
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  placeholder="Enter your wallet address"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={(e) => handleSubmit(e as any, close)}
                disabled={
                  !amount ||
                  Number(amount) > maxAmount ||
                  (withdrawMethod === "credit"
                    ? !cardNumber
                    : !cryptoAddress || !selectedCrypto)
                }
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                Withdraw ${amount || "0"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
