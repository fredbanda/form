"use client"

import Facebook from "@/assets/facebook.webp"
import Instagram from "@/assets/instagram.png"
import Image from "next/image";

export function ExecutiveToursFooterBrand() {
  return (
    <p className="mt-4 text-center text-xs text-muted-foreground">
      Transport provided by{" "}
      <span className="font-semibold tracking-wide text-foreground">
        Executive Tours & Transfers
      </span>
      <span className="block">
        <a
          href="https://www.facebook.com/exectours/"
          className="font-semibold tracking-wide text-foreground"
        >
          <Image
            src={Facebook}
            width={16}
            height={16}
            alt="Instagram"
            className="inline-block h-4 w-4 ml-2"
          />
          #wehere2takeuthere
        </a>{" "}
        <a
          href="https://www.instagram.com/executive_tours_transfers/"
          className="font-semibold tracking-wide text-foreground"
        >
          <Image
            src={Instagram}
            width={16}
            height={16}
            alt="Instagram"
            className="inline-block h-4 w-4"
          />{" "}
          #letustakeuthere
        </a>{" "}
      </span>
    </p>
  );
}



