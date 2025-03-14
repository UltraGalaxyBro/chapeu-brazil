<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="referrer" content="same-origin">
        <meta name="robots" content="index, follow">
        <meta name="author" content="Chapéu Brazil">
        <meta name="geo.region" content="BR">
        <link rel="canonical" href="https://chapeubrazil.com.br">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/favicon.ico">
        <title inertia>{{ config('app.name', 'Chapéu Brazil') }}</title>
        <meta name="description" content="Chapéu Brazil: Sua loja online especializada em chapéus, bonés, perucas, echarpes, proteção UV e acessórios de praia. Qualidade, estilo e proteção para todas as estações. Compre agora!">
        <meta name="keywords" content="chapéus, bonés, perucas, echarpes, proteção UV, acessórios de praia, bolsas de praia, moda praia, chapéus de praia, chapelaria, Brasil, UVline">
        <meta name="application-name" content="Chapéu Brazil">
        <meta name="theme-color" content="#fcdfac">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <!-- Tags Open Graph para compartilhamento em redes sociais -->
        <meta property="og:title" content="Chapéu Brazil | Chapéus, Bonés e Acessórios de Praia">
        <meta property="og:description" content="Chapéu Brazil: Sua loja online especializada em chapéus, bonés, perucas, echarpes, proteção UV e acessórios de praia. Qualidade, estilo e proteção para todas as estações.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://chapeubrazil.com.br">
        <meta property="og:image" content="https://chapeubrazil.com.br/imagens/logo-chapeu-brazil.jpg">
        <meta property="og:site_name" content="Chapéu Brazil">
        <meta property="og:locale" content="pt_BR">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Chapéu Brazil | Chapéus, Bonés e Acessórios de Praia">
        <meta name="twitter:description" content="Chapéu Brazil: Sua loja online especializada em chapéus, bonés, perucas, echarpes, proteção UV e acessórios de praia.">
        <meta name="twitter:image" content="https://chapeubrazil.com.br/imagens/logo-chapeu-brazil.jpg">
        <!-- Tags estruturadas (Schema.org) para e-commerce -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Chapéu Brazil",
          "description": "Loja especializada em chapéus, bonés, perucas, echarpes, vestimentas UV e bolsas de praia.",
          "url": "https://chapeubrazil.com.br",
          "logo": "https://chapeubrazil.com.br/images/logo.png",
          "telephone": "+5500000000000",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "BR"
          },
          "priceRange": "$$"
        }
        </script>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>