import { createEffect, createSignal } from "solid-js";
import ms from "ms";

function whenIsNextRockerTime() {
  const rockertime = new Date();
  rockertime.setMilliseconds(0);
  rockertime.setMinutes(4);
  rockertime.setHours(19);

  if (rockertime.getTime() < Date.now())
    rockertime.setDate(rockertime.getDate() + 1);

  return rockertime;
}

export default function Home() {
  const [rockerTime, setRockerTime] = createSignal(
    whenIsNextRockerTime().getTime() - Date.now()
  );

  createEffect(() => {
    let canceled = false;

    function update() {
      setRockerTime(whenIsNextRockerTime().getTime() - Date.now());

      document.title = `${ms(rockerTime(), { long: true })} until rocker time`;

      if (!canceled) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);

    () => (canceled = true);
  });

  const now = new Date();
  const isRockerTime = now.getHours() == 19 && now.getMinutes() == 4;

  return isRockerTime ? (
    <h1 class="text-7xl mx-auto w-max p-12">Rocker time!!!</h1>
  ) : (
    <main class="text-center mx-auto text-gray-700 p-4">
      {ms(rockerTime(), { long: true })} until rocker time
      <progress max={86400000} value={rockerTime()} />
    </main>
  );
}
