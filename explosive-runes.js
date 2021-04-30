const actorData = actor || canvas.tokens.controlled[0] || game.user.character;
let spelldc = actorData.data.data.attributes.spelldc;
let spellx;
let highcast = "";

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
  title: 'Explosive Runes: Usage Configuration',
  content: `
  <form style="font-size:13px" class="dnd5e" id="ability-use-form">
    <p>Configure how you would like to use the Explosive Runes option.</p>
    <p class="notes"></p>
    <div class="form-group">
      <label>Cast at Level</label>
        <select name="level">`+ spellx + `
        </select>
    </div>
    <div class="form-group">
      <label>Damage Type</label>
        <select name="damage">
          <option value="acid">Acid</option>
          <option value="cold">Cold</option>
          <option value="fire">Fire</option>
          <option value="lightning">Lightning</option>
          <option value="thunder">Thunder</option>
        </select>
    </div>
    <div class="form-group">
        <label class="checkbox">
            <input type="checkbox" id="GlyphTemplate" checked="">
            Place Measured Template
        </label>
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
        let damage = html.find('[name="damage"]').val();

        if (document.getElementById('GlyphTemplate').checked == true)
        {
          drawTemplate();
        }

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
          card.entries.push({ type: "header", img: this.data.img, title: "Explosive Runes" + highcast });
          card.entries.push({ type: "description", content: "<p>When triggered, the glyph erupts with magical energy in a 20-foot-radius sphere centered on the glyph. The sphere spreads around corners. Each creature in the area must make a Dexterity saving throw. A creature takes 5d8 acid, cold, fire, lightning, or thunder damage on a failed saving throw (your choice when you create the glyph), or half as much damage on a successful one.</p><p><b><i>At Higher Levels.</b></i> When you cast this spell using a spell slot of 4th level or higher, the damage of an explosive runes glyph increases by 1d8 for each slot level above 3rd.</p>" });
          card.entries.push({ type: "button-save", hideDC: false, ability: "dex", dc: spelldc });

          card.addField(["damage", { formula: level + "d8", damageType: damage }]);

          card.properties.push(["Abjuration"]);
          card.properties.push(["3rd Level"]);
          card.properties.push(["Special"]);
          card.properties.push(["Instantaneous"]);
          card.properties.push(["Target: Sphere (20 Feet)"]);

          card.toMessage()

        })();
      }
    },
  },
  default: 'yes',
  close: () =>
  {
  }
}).render(true)

function drawTemplate()
{
  let templateData = {
    t: "circle",
    user: game.user._id,
    distance: 20,
    direction: 0,
    x: 0,
    y: 0,
    fillColor: game.user.color
  }
  
  let template = new game.dnd5e.canvas.AbilityTemplate(templateData)
  template.drawPreview()
}