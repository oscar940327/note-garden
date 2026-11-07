// micromorph 0.4.5 ships this signature, but its package exports do not expose
// the declaration file to TypeScript's bundler resolver.
declare module "micromorph" {
  export default function micromorph(from: Node, to: Node): Promise<void>
}
