import type { dictionary } from "../../lib/i18n";

// A Game's cover, or a dashed placeholder frame with the Game's initial when the Source has none.
export function Cover({
  url,
  name,
  t,
  large,
}: {
  url: string | null;
  name: string;
  t: ReturnType<typeof dictionary>;
  large?: boolean;
}) {
  const [width, height] = large ? [264, 374] : [96, 136];
  return url ? (
    <img
      className="cover"
      src={url}
      alt={t.cover(name)}
      width={width}
      height={height}
      loading={large ? undefined : "lazy"}
    />
  ) : (
    <div className="cover cover-placeholder" role="img" aria-label={t.noCover(name)}>
      <span aria-hidden="true">{name.charAt(0)}</span>
    </div>
  );
}
