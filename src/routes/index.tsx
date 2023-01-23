import { createEffect, createSignal } from "solid-js";
import ms from "ms";
import { Title } from "solid-start";

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

  const now = new Date();
  const [isRockerTime, setIsRockerTime] = createSignal(
    now.getHours() == 19 && now.getMinutes() == 4
  );

  createEffect(() => {
    let canceled = false;

    function update() {
      const timeRemaining = whenIsNextRockerTime().getTime() - Date.now();
      setRockerTime(timeRemaining);
      const now = new Date();
      setIsRockerTime(now.getHours() == 19 && now.getMinutes() == 4);

      if (!canceled) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);

    () => (canceled = true);
  });

  const day = ms("1 day");

  const r = 45;
  const c = Math.PI * (r * 2);
  return isRockerTime() ? (
    <h1 class="text-7xl mx-auto w-max p-12">Rocker time!!!</h1>
  ) : (
    <main class="h-full w-full flex items-center justify-center flex-col gap-2">
      <svg class="w-80 h-80 absolute" viewBox="-60 -60 120 120">
        <circle r={45} stroke-width={2} fill="transparent" stroke="#0001" />
        <circle
          r={r}
          stroke-width={2}
          stroke-dasharray={`${Math.PI * 45 * 2}`}
          stroke-dashoffset={`${(1 - rockerTime() / day) * c}px`}
          fill="transparent"
          stroke-linecap="round"
          class="text-blue-600 -rotate-90"
          stroke="currentcolor"
        />
      </svg>
      <Title>{ms(rockerTime(), { long: true })} until rocker time</Title>
      <div class="text-4xl">{ms(rockerTime(), { long: true })}</div>
      <div class="relative text-lg"> until rocker time</div>
    </main>
  );
}
