from django.db import models
from django.db.models import Window, F, Q, Value
from django.db.models.functions import Rank


# Create your models here.
def df():
    return models.DecimalField(max_digits=2, decimal_places=1)


class MatchupChart(models.Model):
    fighter = models.CharField(max_length=20, primary_key=True)
    steve = df()
    sonic = df()
    mr_game_and_watch = df()
    snake = df()
    pyra_mythra = df()
    r_o_b = df()
    peach_daisy = df()
    fox = df()
    diddy_kong = df()
    joker = df()
    kazuya = df()
    min_min = df()
    cloud = df()
    yoshi = df()
    samus_dark_samus = df()
    palutena = df()
    pikachu = df()
    sora = df()
    roy = df()
    wario = df()
    wolf = df()
    mario = df()
    pac_man = df()
    pokemon_trainer = df()
    shulk = df()
    bayonetta = df()
    corrin = df()
    lucina = df()
    terry = df()
    zero_suit_samus = df()
    sheik = df()
    ryu = df()
    olimar = df()
    greninja = df()
    falco = df()
    mii_brawler = df()
    sephiroth = df()
    young_link = df()
    luigi = df()
    captain_falcon = df()
    pit = df()
    dark_pit = df()
    byleth = df()
    rosalina_and_luma = df()
    hero = df()
    ken = df()
    toon_link = df()
    ness = df()
    mega_man = df()
    inkling = df()
    meta_knight = df()
    ice_climbers = df()
    incineroar = df()
    pichu = df()
    chrom = df()
    marth = df()
    link = df()
    lucario = df()
    mii_gunner = df()
    bowser = df()
    jigglypuff = df()
    lucas = df()
    banjo_and_kazooie = df()
    wii_fit_trainer = df()
    ridley = df()
    duck_hunt = df()
    mewtwo = df()
    robin = df()
    donkey_kong = df()
    isabelle = df()
    bowser_jr = df()
    ike = df()
    villager = df()
    zelda = df()
    simon_richter = df()
    kirby = df()
    mii_swordfighter = df()
    piranha_plant = df()
    dr_mario = df()
    king_dedede = df()
    king_k_rool = df()
    little_mac = df()
    ganondorf = df()

    def counterpick(name, mthr=-0.5, ctol=-0.5, weighted=True):
        # data validation
        ## name
        if not MatchupChart.objects.filter(fighter=name):
            return {
                "msg": "invalid name",
                "name": name,
                "mthr": mthr,
                "ctol": ctol,
                "weighted": weighted,
            }
        ## matchup threshold
        if mthr < -3.0 or mthr > -0.1:
            return {
                "msg": "mthr out of range [-3, -0.1]",
                "name": name,
                "mthr": mthr,
                "ctol": ctol,
                "weighted": weighted,
            }
        ## counterpick tolerance
        if ctol < -1.0 or ctol > -0.1:
            return {
                "msg": "ctol out of range [-1, -0.1]",
                "name": name,
                "mthr": mthr,
                "ctol": ctol,
                "weighted": weighted,
            }

        # find all bad matchups
        # sql pseudocode:
        # (matchups, values, weights) @ bad =
        #   SELECT
        #     fighter,
        #     {name},
        #     (rank() OVER (ORDER BY {name} ASC) if weighted else 1) AS weight
        #  FROM matchup_chart
        #  WHERE {name} >= -{mthr}
        #  ORDER BY {name} DESC;
        bad = (
            MatchupChart.objects.annotate(
                weight=Window(expression=Rank(), order_by=name)
                if weighted
                else Value(1)
            )
            .filter(**{f"{name}__gte": -mthr})
            .order_by(f"-{name}")
            .values_list("fighter", name, "weight")
        )

        if not bad:
            return {
                "msg": "no bad matchups",
                "name": name,
                "mthr": mthr,
                "ctol": ctol,
                "weighted": weighted,
            }

        matchups, values, weights = zip(*bad)

        # for each counterpick, determine if it is a good counterpick
        # sql pseudocode:
        # cp =
        #   SELECT
        #     fighter,
        #     matchups[0] [, m for matchups[1:]],
        #     (matchups[0] + values[0]) * weights[0]
        #       [+ (m + v) * w for m, v, w in bad[1:]] AS score
        #   FROM matchup_chart
        #   WHERE
        #     fighter = {name}
        #     OR (score >= 0 [AND m >= -v + {ctol} for m, v, _ in bad])
        #   ORDER BY score DESC;
        score_query = (F(matchups[0]) + values[0]) * weights[0]
        value_query = {f"{matchups[0]}__gte": -values[0] + Value(ctol)}
        for m, v, w in bad[1:]:
            score_query += (F(m) + v) * w
            value_query[f"{m}__gte"] = -v + Value(ctol)

        counterpicks = (
            MatchupChart.objects.annotate(score=score_query)
            .filter(Q(fighter=name) | (Q(score__gte=0) & Q(**value_query)))
            .order_by("-score")
            .values_list("fighter", *matchups, "score")
        )

        if len(counterpicks) == 1:
            return {
                "msg": "no suitable counterpicks",
                "name": name,
                "mthr": mthr,
                "ctol": ctol,
                "weighted": weighted,
            }

        # return result
        # json pseudcode:
        # {
        #   'cp0': {
        #     'bm0': val0,
        #     'bm1': val1,
        #     ...
        #     'score': score
        #   },
        #   ...
        #   'fighter': {
        #     'bm0': val0,
        #     'bm1': val1,
        #     ...
        #     'score': score
        #   }
        # }
        def make_counterpick_dict(counterpick):
            return dict(zip(matchups + ("score",), [float(v) for v in counterpick[1:]]))

        return {c[0]: make_counterpick_dict(c) for c in counterpicks}
