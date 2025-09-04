export default defineNuxtConfig({
    site: {
        name: 'opensource.duma.sh',
    },
    content: {
        build: {
            markdown: {
                highlight: {
                    theme: {
                        // Default theme (same as single string)
                        default: 'github-light',
                        // Theme used if `html.dark`
                        dark: 'github-dark',
                        // Theme used if `html.sepia`
                        sepia: 'monokai'
                    },
                    langs: ['diff', 'json', 'js', 'ts', 'css', 'shell', 'html', 'md', 'yaml', 'php', 'csharp', 'python']
                }
            }
        }
    },
    llms: {
        domain: 'https://opensource.duma.sh',
        title: 'opensource.duma.sh',
        description: 'Open Source Software by Krystian Duma',
        // sections: [
        //     {
        //         title: 'Section 1',
        //         description: 'Section 1 Description',
        //         links: [
        //             {
        //                 title: 'Link 1',
        //                 description: 'Link 1 Description',
        //                 href: '/link-1',
        //             },
        //             {
        //                 title: 'Link 2',
        //                 description: 'Link 2 Description',
        //                 href: '/link-2',
        //             },
        //         ],
        //     },
        // ],
        notes: '',
        full: {
            title: 'opensource.duma.sh (full)',
            description: 'Open Source Software by Krystian Duma - Full Documentation',
        },
    },
})