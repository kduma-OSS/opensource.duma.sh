import type { DefinedCollection } from '@nuxt/content'
import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'
import { joinURL } from 'ufo'

const { options } = useNuxt()
const cwd = joinURL(options.rootDir, 'content')

const createDocsSchema = () => z.object({
    title: z.string(),
    description: z.string(),

    type: z.string().optional(),
    platform: z.string().optional(),
    active: z.boolean().default(true).optional(),
    featured: z.number().optional(),
    featured_description: z.string().optional(),
    featured_icon: z.string().optional(),
    github: z.string().optional(),
    list_title: z.string().optional(),
    system: z.string().optional(),
    system_url: z.string().optional(),

    layout: z.string().optional(),
    links: z.array(z.object({
        label: z.string(),
        icon: z.string(),
        to: z.string(),
        target: z.string().optional(),
    })).optional(),
})

let collections: Record<string, DefinedCollection> = {
    landing: defineCollection({
        type: 'page',
        source: {
            cwd,
            include: 'index.md',
        },
    }),
    docs: defineCollection({
        type: 'page',
        source: {
            cwd,
            include: '**',
            exclude: ['index.md'],
        },
        schema: createDocsSchema(),
    }),
    data: defineCollection({
        type: 'data',
        source: {
            cwd: joinURL(options.rootDir, 'data'),
            include: '**/*.json',
            exclude: [],
        },
        schema: createDocsSchema(),
    }),
}

export default defineContentConfig({ collections })