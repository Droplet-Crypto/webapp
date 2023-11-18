export function CoreFrame(props: {
  title: string;
  goBack?: () => void;
  children: any;
}) {
  return (
    <div>
      <header>
        {props.goBack ? (
          <p onClick={props.goBack}>Back</p>
        ) : (
          <div />
        )}
        <p>{props.title}</p>
        <div />
      </header>
      {props.children}
    </div>
  );
}
