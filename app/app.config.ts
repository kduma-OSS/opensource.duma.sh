export default defineAppConfig({
    seo: {
        // Default to `%s - ${site.name}`
        titleTemplate: '%s - opensource.duma.sh',
        // Default to package.json name
        title: 'opensource.duma.sh',
        // Default to package.json description
        description: 'Open Source Software by Krystian Duma'
    },
    header: {
        // Title to display if no logo
        title: 'opensource.duma.sh',
        // Logo configuration
        // logo: {
        //     alt: '',
        //     // Light mode
        //     light: '',
        //     // Dark mode
        //     dark: ''
        // },
    },
    socials: {
        // x: 'https://x.com/nuxt_js',
        // discord: 'https://discord.com/invite/ps2h6QT',
        // nuxt: 'https://nuxt.com',
    },

    toc: {
        title: 'On this page',
        // Add a bottom section to the table of contents
        // bottom: {
        //     title: 'Community',
        //     links: [{
        //         icon: 'i-lucide-book-open',
        //         label: 'Nuxt UI Pro docs',
        //         to: 'https://ui.nuxt.com/getting-started/installation/pro/nuxt',
        //         target: '_blank'
        //     }, {
        //         icon: 'i-simple-icons-nuxtdotjs',
        //         label: 'Purchase a license',
        //         to: 'https://ui.nuxt.com/pro/purchase',
        //         target: '_blank'
        //     }]
        // }
    },

    github: {
        url: 'https://github.com/kduma-OSS/opensource.duma.sh',
        branch: 'main',
        rootDir: ''
    }
})