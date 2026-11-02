import type { ReactNode } from "react";

type Props = {
  name: string;
  buttonComponent?: ReactNode;
  isSmallText?: boolean;
};

const Header = ({ name, buttonComponent, isSmallText = false }: Props) => {
  const Heading = isSmallText ? "h2" : "h1";
  return (
    <div
      className={`${isSmallText ? "mb-4" : "app-halftone mb-7 border-b border-line pb-6"} relative flex w-full flex-wrap items-center justify-between gap-4 overflow-hidden`}
    >
      <Heading
        className={`${isSmallText ? "text-lg" : "text-3xl leading-none sm:text-[2.75rem]"} relative z-10 font-mono font-semibold tracking-[-0.06em] text-ink`}
      >
        {name}
      </Heading>
      <div className="relative z-10">{buttonComponent}</div>
    </div>
  );
};

export default Header;
