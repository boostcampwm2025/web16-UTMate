"use client";

import { useRouter } from "next/navigation";

import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import { logout } from "@/features/(auth)/apis/client";

export function LogoutButton() {

  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleLogout}>
      로그아웃
    </DropdownMenuItem>
  );
}

