export interface Metadata {
  paragraphs?: MetadataParagraph[];
}

export interface MetadataParagraph {
  header?: string;
  content?: string;
}
