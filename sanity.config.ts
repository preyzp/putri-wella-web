"use client";
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { defineLocations, presentationTool } from 'sanity/presentation';
import { getSanityEnvironment, type SanityEnvironment } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemas';
import { singletonTypes, structure } from './src/sanity/structure';

export function createStudioConfig(environment: SanityEnvironment) {
  return defineConfig({
    name: 'putri', title: 'Putri Wella Sibarani', basePath: '/studio',
    projectId: environment.projectId, dataset: environment.dataset,
    plugins: [structureTool({ structure }), presentationTool({
      title: 'Preview draft',
      previewUrl: { initial: '/id/preview/tulisan', previewMode: { enable: '/api/draft-mode/enable', shareAccess: false } },
      resolve: { locations: { post: defineLocations({
        select: { title: 'title', slug: 'slug.current' },
        resolve: value => value?.slug ? { locations: [{ title: value.title || 'Preview draft', href: `/id/preview/tulisan/${encodeURIComponent(value.slug)}` }] } : { locations: [], message: 'Isi slug untuk membuka preview draft.', tone: 'caution' },
      }) } },
    })],
    schema: { types: schemaTypes, templates: templates => templates.filter(template => !singletonTypes.has(template.schemaType)) },
    document: {
      newDocumentOptions: options => options.filter(option => !singletonTypes.has(option.templateId)),
      actions: (actions, context) => {
        if (context.schemaType === 'newsletterIssue') return actions.filter(action => action.action === 'delete' || action.action === 'discardChanges');
        if (singletonTypes.has(context.schemaType)) return actions.filter(action => action.action !== 'duplicate' && action.action !== 'delete');
        return actions;
      },
    },
  });
}

const environment = getSanityEnvironment();
// No fake project/dataset and no module-scope exception when unconfigured.
const config = environment.configured ? createStudioConfig(environment.value) : null;
export default config;
