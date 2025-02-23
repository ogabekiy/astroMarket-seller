"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      
    }else{
      router.push("dashboard/products")
    }
  }, [router]);

  return <div>
    {/* <img src="http://localhost:3000/uploads/Mikrovolnovka-iytfpid4-1.png" alt="xa" /> */}
  </div>;
}
