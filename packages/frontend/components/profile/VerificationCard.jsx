
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap, CreditCard, Shield } from "lucide-react";

const verificationData = {
  celebrity: {
    icon: Crown,
    color: "text-yellow-400 bg-yellow-400/20",
    title: "Celebrity Verified",
    description: "Exclusive verification for public figures",
    price: "Free (Admin approval required)"
  },
  lifetime: {
    icon: Star,
    color: "text-purple-400 bg-purple-400/20",
    title: "Lifetime Verified",
    description: "One-time payment for permanent verification",
    price: "₦5,000 - ₦20,000"
  },
  monthly: {
    icon: Zap,
    color: "text-blue-400 bg-blue-400/20",
    title: "Monthly Verified",
    description: "Affordable monthly verification plan",
    price: "₦1,000 - ₦5,000/month"
  }
};

export default function VerificationCard({ verificationType, userRole }) {
  const currentVerification = verificationData[verificationType];
  const isVerified = verificationType && verificationType !== 'none';

  return (
    <Card className="bg-zinc-800/50 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isVerified ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
              {React.createElement(currentVerification.icon, {
                className: "w-8 h-8 text-white"
              })}
            </div>
            <Badge className={`${currentVerification.color} border-0 mb-2`}>
              {currentVerification.title}
            </Badge>
            <p className="text-zinc-400 text-sm">
              {currentVerification.description}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-zinc-400 mb-4">
              Get verified to unlock premium features and build trust with your contacts.
            </p>
            
            <div className="space-y-3">
              {Object.entries(verificationData).map(([type, data]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {React.createElement(data.icon, {
                      className: `w-5 h-5 ${data.color.split(' ')[0]}`
                    })}
                    <div>
                      <p className="text-white font-medium">{data.title}</p>
                      <p className="text-xs text-zinc-400">{data.price}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {type === 'celebrity' ? 'Apply' : 'Purchase'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
