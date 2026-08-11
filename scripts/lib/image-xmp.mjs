const requiredRootFields = ["creator", "credit", "rights", "webStatement"];
const requiredAssetFields = ["title", "description"];
const locationFields = ["city", "state", "country", "countryCode"];

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Image SEO metadata field ${label} must be a non-empty string.`);
  }
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function validateImageSeoManifest(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error("Image SEO metadata manifest must be an object.");
  }

  if (manifest.version !== 1) {
    throw new Error("Image SEO metadata manifest version must be 1.");
  }

  for (const field of requiredRootFields) {
    assertNonEmptyString(manifest[field], field);
  }

  if (!manifest.assets || typeof manifest.assets !== "object" || Array.isArray(manifest.assets)) {
    throw new Error("Image SEO metadata manifest must contain an assets object.");
  }

  for (const [filename, asset] of Object.entries(manifest.assets)) {
    assertNonEmptyString(filename, "asset filename");
    if (!/\.jpe?g$/i.test(filename)) {
      throw new Error(`Image SEO metadata asset ${filename} must be a JPEG filename.`);
    }
    if (!asset || typeof asset !== "object" || Array.isArray(asset)) {
      throw new Error(`Image SEO metadata asset ${filename} must be an object.`);
    }
    for (const field of requiredAssetFields) {
      assertNonEmptyString(asset[field], `${filename}.${field}`);
    }

    if (asset.location !== undefined) {
      if (
        !asset.location ||
        typeof asset.location !== "object" ||
        Array.isArray(asset.location)
      ) {
        throw new Error(`Image SEO metadata location for ${filename} must be an object.`);
      }
      for (const field of locationFields) {
        assertNonEmptyString(asset.location[field], `${filename}.location.${field}`);
      }
    }
  }

  return manifest;
}

export function buildSafeXmp(manifest, asset) {
  const creator = escapeXml(manifest.creator);
  const credit = escapeXml(manifest.credit);
  const rights = escapeXml(manifest.rights);
  const webStatement = escapeXml(manifest.webStatement);
  const title = escapeXml(asset.title);
  const description = escapeXml(asset.description);
  const location = asset.location;

  const locationNamespaces = location
    ? ' xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"'
    : "";
  const locationAttributes = location
    ? ` photoshop:City="${escapeXml(location.city)}" photoshop:State="${escapeXml(location.state)}" photoshop:Country="${escapeXml(location.country)}" Iptc4xmpCore:CountryCode="${escapeXml(location.countryCode)}"`
    : "";

  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"${locationNamespaces} photoshop:Credit="${credit}" xmpRights:WebStatement="${webStatement}"${locationAttributes}>
      <dc:creator><rdf:Seq><rdf:li>${creator}</rdf:li></rdf:Seq></dc:creator>
      <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${rights}</rdf:li></rdf:Alt></dc:rights>
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${title}</rdf:li></rdf:Alt></dc:title>
      <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${description}</rdf:li></rdf:Alt></dc:description>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}
