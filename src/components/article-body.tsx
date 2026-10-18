import Image from 'next/image';
import type { ContentBlock, SampleImage } from '@/fixtures/posts';

export function EditorialImage({ image }: { image: SampleImage }) {
  return <figure><Image src={image.src} alt={image.alt} width={1200} height={750} sizes="(max-width: 768px) 100vw, 720px" /><figcaption>{image.caption}</figcaption></figure>;
}

export function ArticleBody({ blocks }: { blocks: ContentBlock[] }) {
  return <div className="article-body">{blocks.map((block, index) => {
    switch (block.type) {
      case 'heading': { const Heading = `h${block.level}` as 'h2' | 'h3' | 'h4'; return <Heading key={index}>{block.text}</Heading>; }
      case 'paragraph': return <p key={index}>{block.text}</p>;
      case 'quote': return <blockquote key={index}><p>{block.text}</p></blockquote>;
      case 'poemStanza': return <p key={index} className="poem">{block.text}</p>;
      case 'list': { const List = block.ordered ? 'ol' : 'ul'; return <List key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</List>; }
      case 'image': return <EditorialImage key={index} image={block.image} />;
    }
  })}</div>;
}
