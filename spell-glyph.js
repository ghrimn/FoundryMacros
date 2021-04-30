const actorData = actor || canvas.tokens.controlled[0] || game.user.character;
let spelldc = actorData.data.data.attributes.spelldc;
let spellx;
let highcast = "";
let itemsArray = actorData.data.items;

(async () =>
{
  for (let i = 3; i < 10; i++)
  {
    let spells = actorData.data.data.spells["spell" + i];

    if (spells.max > 0)
    {
      if (i == 3)
      {
        spellx = `<option value="5">3rd Level</option>`;
      } else
      {
        spellx = spellx + `<option value="` + (5 + (i - 3)) + `">` + i + `th Level</option>`;
      }
    }
  }
})();

let d = new Dialog({
  title: 'Spell Glyph: Usage Configuration',
  content: `
  <form style="font-size:13px" class="dnd5e" id="ability-use-form">
  <p>Configure how you would like to use the Spell Glyph option.</p>
  <p class="notes"></p>
  <div class="form-group">
      <label>Cast at Level</label>
          <select name="level" id="GlyphLevel">` + spellx + `
          </select>
      </div>
      <div class="form-group">
      <label>Stored Spell</label>
          <select name="spell" id="spellStore">      
          </select>
      </div>
  </div>  
</form>
  `,
  buttons: {
    yes: {
      icon: '<i class="fas fa-magic"></i>',
      label: 'Cast Spell',
      callback: (html) =>
      {
        let level = html.find('[name="level"]').val();
        let spell = html.find('[name="spell"]').val();

        if (level > 5)
        {
          highcast = " (" + (level - 2) + "th Level)";
        }

        (async () =>
        {
          const settings = {
            damagePromptEnabled: true,
          };

          if (!actorData)
          {
            ui.notifications.warn("No actor selected");
          }

          const card = BetterRolls.rollItem(actorData, { settings });
          card.entries.push({ type: "header", img: this.data.img, title: "Spell Glyph" + highcast });
          card.entries.push({ type: "description", content: "<p>You can store a prepared spell of 3rd level or lower in the glyph by casting it as part of creating the glyph. The spell must target a single creature or an area. The spell being stored has no immediate effect when cast in this way. When the glyph is triggered, the stored spell is cast. If the spell has a target, it targets the creature that triggered the glyph. If the spell affects an area, the area is centered on that creature. If the spell summons hostile creatures or creates harmful objects or traps, they appear as close as possible to the intruder and attack it. If the spell requires concentration, it lasts until the end of its full duration.</p><p><b><i>At Higher Levels.</b></i> When you cast this spell using a spell slot of 4th level or higher, you can store any spell of up to the same level as the slot you use for the glyph of warding.</p>" });

          card.properties.push(["Abjuration"]);
          card.properties.push(["3rd Level"]);
          card.properties.push(["Special"]);
          card.properties.push(["Spell: " + spell]);

          card.toMessage()

        })();
        const spellName = "" + spell + "";
        actor.items.find(i => i.name === spellName).roll({ createMessage: false });
      }
    },
  },
  default: 'yes',
  render: html =>
  {
    spellLevel();
    document.getElementById("GlyphLevel").onchange = function () { spellLevel() };
  },
  close: () =>
  {
  }
}).render(true);

function spellLevel()
{
  let level = document.getElementById("GlyphLevel").value;
  document.getElementById("spellStore").innerHTML = "";
  itemsArray.sort((a, b) => (a.data.level > b.data.level) ? 1 : (a.data.level === b.data.level) ? ((a.name > b.name) ? 1 : -1) : -1)

  for (let j = 0; j < itemsArray.length; j++)
  {
    if (itemsArray[j].type == "spell")
    {
      if (0 < itemsArray[j].data.level && itemsArray[j].data.level <= level - 2)
      {
        if (!(itemsArray[j].data.target.type == "self" || itemsArray[j].data.target.type == "object"))
        {
          document.getElementById("spellStore").innerHTML += `<option value="` + itemsArray[j].name + `">` + itemsArray[j].name + `</option>`;
        }
      }
    }
  }
}