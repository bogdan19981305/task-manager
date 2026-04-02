import Footer from "@/shared/components/layout/footer";
import Header, { NavigationSection } from "@/shared/components/layout/header";

const navigationData: NavigationSection[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header navigationData={navigationData} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default PublicLayout;
