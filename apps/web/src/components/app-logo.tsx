import Image from "next/image";

export function AppLogo() {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={24}
      height={24}
      className="size-6 shrink-0 object-contain"
      loading="eager"
    />
  );
}
