/** Sets body classes before paint so inner pages do not flash a transparent header. */
export function BodyRouteClassScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var p=location.pathname;if(p==='/'||p===''){document.body.classList.add('home-2025');document.body.classList.remove('_menu_sticky');}else{document.body.classList.remove('home-2025');document.body.classList.add('_menu_sticky');}})();`,
      }}
    />
  );
}
