import { validateRequest } from "@/lib/auth/lucia";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const { user } = await validateRequest();

  if (user) redirect("/recipes");

  return (
    <div className="flex h-full justify-center">
      <div className="my-auto rounded-xl bg-neutral-50 py-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-6">
            <Logo /> <span className="text-xl font-semibold">Little Chef</span>
          </div>

          <div className="flex flex-col px-8">
            <div className="mt-4">
              Little Chef is currently in a private alpha, <em>but</em> you can
              view public recipes.
            </div>
            <div className="mt-16 flex flex-wrap gap-2">
              <Link
                href="/sign-up"
                className="min-w-64 flex-1 rounded-lg border-2 border-lime-200 bg-lime-100 px-4 py-2 text-center font-medium text-lime-700"
              >
                I've got an invite code
              </Link>
              <Link
                href="/recipes"
                className="min-w-64 flex-1 rounded-lg border bg-neutral-100 px-4 py-2 text-center font-medium"
              >
                Continue as a guest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="76"
      className="-rotate-90"
      fill="none"
      viewBox="0 0 50 76"
    >
      <rect
        width="7"
        height="31"
        x="28"
        y="31"
        fill="url(#paint0_linear_0_1)"
        rx="3.5"
        transform="rotate(180 28 31)"
      ></rect>
      <rect
        width="7"
        height="31"
        x="28"
        y="31"
        fill="url(#paint1_linear_0_1)"
        fillOpacity="0.6"
        rx="3.5"
        transform="rotate(180 28 31)"
      ></rect>
      <circle cx="25" cy="51" r="25" fill="#262626"></circle>
      <circle cx="25" cy="51" r="24" fill="url(#paint2_linear_0_1)"></circle>
      <circle
        cx="25"
        cy="51"
        r="24"
        fill="url(#paint3_radial_0_1)"
        fillOpacity="0.2"
      ></circle>
      <circle cx="25" cy="51" r="16" fill="url(#paint4_radial_0_1)"></circle>
      <circle
        cx="25"
        cy="51"
        r="16"
        fill="url(#paint5_linear_0_1)"
        fillOpacity="0.25"
      ></circle>
      <defs>
        <linearGradient
          id="paint0_linear_0_1"
          x1="28"
          x2="35"
          y1="49.318"
          y2="49.318"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#957C4C"></stop>
          <stop offset="0.474" stopColor="#745C2D"></stop>
          <stop offset="1" stopColor="#E3BF77"></stop>
        </linearGradient>
        <linearGradient
          id="paint1_linear_0_1"
          x1="31.5"
          x2="31.5"
          y1="42.5"
          y2="33.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopOpacity="0"></stop>
          <stop offset="1"></stop>
        </linearGradient>
        <linearGradient
          id="paint2_linear_0_1"
          x1="9.5"
          x2="47"
          y1="34"
          y2="62"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1A1A1A"></stop>
          <stop offset="1" stopColor="#3C3B3A"></stop>
        </linearGradient>
        <radialGradient
          id="paint3_radial_0_1"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(0 24 -24 0 25 51)"
          gradientUnits="userSpaceOnUse"
        >
          <stop></stop>
          <stop offset="1" stopOpacity="0"></stop>
        </radialGradient>
        <radialGradient
          id="paint4_radial_0_1"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(16 0 0 16 25 51)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3F3C3C"></stop>
          <stop offset="0.307" stopColor="#3F3C3C"></stop>
          <stop offset="0.703" stopColor="#363333"></stop>
          <stop offset="1" stopColor="#222121"></stop>
        </radialGradient>
        <linearGradient
          id="paint5_linear_0_1"
          x1="20"
          x2="25"
          y1="46"
          y2="51"
          gradientUnits="userSpaceOnUse"
        >
          <stop></stop>
          <stop offset="1" stopOpacity="0"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Page;
