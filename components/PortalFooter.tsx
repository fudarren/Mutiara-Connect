import Image from "next/image";
import Link from "next/link";

const linkGroups = [
  {
    title: "Explore",
    links: [
      { href: "/projects", label: "Construction map" },
      { href: "/news", label: "Construction news" },
      { href: "/notification", label: "Notifications" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/feedback", label: "Report an issue" },
      { href: "/notification-preferences", label: "Notification preferences" },
      { href: "/about", label: "About the portal" },
    ],
  },
];

export function PortalFooter({ variant = "public" }: { variant?: "public" | "admin" }) {
  const admin = variant === "admin";

  return (
    <footer className={`portal-footer ${admin ? "portal-footer--admin" : "hidden sm:ml-[215px] sm:block"}`}>
      <div className="portal-footer-inner">
        <div className="portal-footer-content">
          <div className="portal-footer-intro">
            <Link className="portal-footer-brand" href={admin ? "/admin" : "/"}>
              <span className="portal-footer-logo" aria-hidden="true">
                <Image src="/Mutiara-Connect-Logo.png" alt="" width={64} height={64} />
              </span>
              <span>
                <strong>Mutiara Connect</strong>
                <small>{admin ? "Management portal" : "Penang LRT Mutiara Line"}</small>
              </span>
            </Link>
            {!admin && <p>Construction updates and community information for the Mutiara Line.</p>}
          </div>
          {admin ? (
            <nav className="portal-footer-shortcuts" aria-label="Management footer links">
              <Link href="/">Community portal</Link>
              <Link href="/feedback">Report an issue</Link>
              <Link href="/about">About the portal</Link>
            </nav>
          ) : (
            linkGroups.map((group) => (
              <nav className="portal-footer-links" key={group.title} aria-label={`${group.title} footer links`}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}
                </ul>
              </nav>
            ))
          )}
        </div>
        <div className="portal-footer-bottom">
          <small>Copyright 2026 Mutiara Connect</small>
          <small>Penang, Malaysia</small>
        </div>
      </div>
    </footer>
  );
}
