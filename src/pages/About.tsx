import { Card } from "../components/Card";
import { TitleCard } from "../components/TitleCard";

export default function About() {
  return (
    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
      <TitleCard
        eyebrow="About"
        title="Learn about the world's languages through Wordle-style deduction."
      />

      <div className="flex justify-start text-left flex-col gap-6">
        <Card title="How did Linguistle come to be?">
          <p className="text-lg leading-7 text-slate-200">
            The game's creator is a software engineer and a language enthusiast
            - so he wanted to combine both of these passions into a fun and
            educational game for others to enjoy.
          </p>
        </Card>

        <Card title="How to play">
          <p className="text-lg leading-7 text-slate-200">
            In Linguistle, your job is not to identify a mystery language by how
            it looks, but by its characteristics and features. By guessing
            languages Wordle-style, you can piece together different features
            about the target language, such as its language family, number of
            native speakers, and its rough origin location.
          </p>
        </Card>

        <Card title="What are the modes?">
          <p className="text-lg leading-7 text-slate-200">
            There are three modes in Linguistle: Easy, Normal, and Hard.
          </p>
          <p className="text-lg leading-7 text-slate-200">
            In Easy mode, the target language will be one with{" "}
            <b>more than 40 million speakers</b> - the most familiar and widely
            spoken languages.
          </p>
          <p className="text-lg leading-7 text-slate-200">
            In Normal mode, the target language will be one with{" "}
            <b>more than 10 million speakers</b> - still common, but a bit more
            varied.
          </p>
          <p className="text-lg leading-7 text-slate-200">
            In Hard mode, the target language will be one with{" "}
            <b>between 1 and 50 million speakers</b>, allowing for an
            opportunity to learn about lesser-spoken languages.
          </p>
          <p className="text-lg leading-7 text-slate-200">
            All modes allow any language to be guessed for info, but the target
            language will always be in the specified range for that mode.
          </p>
        </Card>

        <Card title="How many guesses do I get?">
          <p className="text-lg leading-7 text-slate-200">
            You have eight guesses to identify the target language. If you can't
            do it in eight guesses, the language will be revealed to you along
            with your score.
          </p>
        </Card>

        <Card title="About the language data">
          <p>
            {" "}
            This data is sourced openly from{" "}
            <a
              className="text-red-200
            hover:underline"
              href="
            https://github.com/glottolog/glottolog-cldf"
              rel="noreferrer"
              target="_blank"
            >
              Glottolog
            </a>
            , combined with Wikidata's numbers for native speakers. If any data
            is wrong, missing, or seems off, reach out using the Contact link in
            the footer, and I'll do my best to update any inaccuracies.
          </p>

          <p>
            The five areas of origin in the dataset are defined geographically
            as follows:
          </p>
          <img src="/macroareas.png" className="pt-2 w-full" />
        </Card>

        <Card title="How is scoring calculated?">
          <p className="text-lg leading-7 text-slate-200">
            Scoring in Linguistle is based on how efficiently you narrow in on
            the target language.
          </p>
          <p className="mt-3 text-lg leading-7 text-slate-200">
            When a player successfully identifies the target language, they earn
            102 - 2*(number of guesses used) points. A perfect solve in one
            guess earns 100 points, while each additional guess subtracts 2
            points from the total.
          </p>
          <p className="mt-3 text-lg leading-7 text-slate-200">
            If the target is not solved within the allowed guesses, the score is
            still based on the strongest information you gathered.{" "}
            <span className="text-green-400">Correct matches</span> score as
            full value, <span className="text-yellow-400">partial matches</span>{" "}
            as half-value, and{" "}
            <span className="text-red-400">wrong matches</span> as zero. The
            system also adds a distance-based bonus based on how close your
            nearest guess came to the actual language. Each of the four checks
            has equal weight: 25%.
          </p>
          <p className="mt-3 text-lg leading-7 text-slate-200">
            Example: correct language family = 25 points + close number of
            native speakers = 12.5 points + missed origin continent = 0 points +
            1000km away = (20000-1000) / 20000 * 25 = 23.75 points = 61.25
            points
          </p>
        </Card>
      </div>
    </div>
  );
}
