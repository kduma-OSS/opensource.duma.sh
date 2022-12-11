export default defineAppConfig({
  docus: {
    title: 'opensource.duma.sh',
    description: 'Open Source Software by Krystian Duma',
    // url: 'http://docus.dev',
    // image: '/social-card-preview.png',
    socials: {
      github: 'kduma-oss',
    },
    // github: {
    //   root: 'content',
    //   edit: true,
    //   contributors: true
    // },
    aside: {
      level: 1,
    },
    header: {
      showLinkIcon: true
    },
    footer: {
      credits: {
        icon: false,
        text: 'Created by Krystian Duma',
        href: 'https://krystian.duma.sh',
      },
      // iconLinks: [
      //   {
      //     label: 'NuxtJS',
      //     href: 'https://nuxtjs.org',
      //     icon: 'IconNuxtLabs',
      //   },
      //   {
      //     label: 'Vue Telescope',
      //     href: 'https://vuetelescope.com',
      //     icon: 'IconVueTelescope',
      //   },
      // ],
    }
  }
})
