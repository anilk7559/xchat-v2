function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <strong>
      Urheberrecht @
        {year}
      </strong>
    </footer>
  );
}

export default Footer;
