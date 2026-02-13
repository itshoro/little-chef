interface RootProps {
  children: React.ReactNode;
}

const Root = ({ children }: RootProps) => {
  return (
    <article className="rounded-2xl border border-stone-200 bg-stone-50 p-6 dark:border-transparent dark:bg-stone-800">
      {children}
    </article>
  );
};

interface FooterProps {
  description: React.ReactNode;
  actions: React.ReactNode;
}

const Footer = ({ description, actions }: FooterProps) => {
  return (
    <footer className="mt-4 flex flex-wrap items-start justify-between gap-4 border-t border-stone-300 pt-4 text-sm dark:border-stone-700">
      <div className="max-w-prose flex-1 leading-relaxed text-stone-600 dark:text-stone-400">
        {description}
      </div>
      <div className="ml-auto flex shrink-0 gap-2">{actions}</div>
    </footer>
  );
};

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header>
      <h2 className="mb-2 text-lg leading-snug">{title}</h2>
    </header>
  );
};

const SettingsCard = Object.assign(Root, { Header, Footer });

export { SettingsCard };
