//Namespace Definition
if (typeof DRLogPrettifier == "undefined" || !DRLogPrettifier) { var DRLogPrettifier=function(){}; }

DRLogPrettifier.options = {
  anonymize: {
    stripNames: false, // Options: false, "genericWord", ["Alice", "Bob", "Carol"]
    overrideLooks: false
  },
  sanitize: {
    commandPrompt: true,
    whispers: "convert", // Options: false, true, "convert"
    combatString: false,
  },
  highlight: {
    speech: {
      pattern: /[A-Za-z]+ ([a-z]+ly )?(say|ask|exclaim)s?( to [A-Za-z]+,| something in [A-Za-z]+\.|,)?,/g,
      color: "green"
    },
    gweth: {
      pattern: /Your mind hears.* thinking,\n/g,
      color: "red",
    }
  },
  unperspective: "Rekletiva",
  
  textarea_id: "logcontent"
};

DRLogPrettifier.prototype = {
  process: function() {
    this.log = document.getElementById(DRLogPrettifier.options.textarea_id).value;
    this.sanitize();
    this.anonymize();
    this.highlight();
    this.output();
  },
  
  anonymize: function() {
  },
  
  sanitize: function() {
    if (DRLogPrettifier.options.sanitize.whispers == "convert") {
      this.log = this.log.replace(/(.*>(wh[^ ]*) [^ ]+ (.*))\nYou whisper to ([A-Za-z]+)\./g, "$1\nYou whisper to $3, \"$2\"");
    }
    this.log = this.log.replace(/.*whisper.*".*OOC.*\n/gi, ""); // Crappy regex to kill all OOC whispers.
    //this.log = this.log.replace(/You see.*\n.*\n((He|She).*\n{1,2})+/g, "<div class=\"characterlook\">$&</div>"); // This isn't working yet.
    if (DRLogPrettifier.options.unperspective) {
      this.log = this.log.replace(/to you([^r])/g, "to "+DRLogPrettifier.options.unperspective+"$1");
      this.log = this.log.replace(/\nYou hear your mental voice echo, (.*)/g, "\nYour mind hears "+DRLogPrettifier.options.unperspective+" thinking, \"$1\"");
      this.log = this.log.replace(/\nYou ([a-z]+)/g, "\n"+DRLogPrettifier.options.unperspective+" $1s");
    }
    this.log = this.log.replace(/\nBesides yourself,.*\n(    [A-Za-z]+\n)+/g, ""); // Sanitize "ASSESS GROUP"
    if (DRLogPrettifier.options.sanitize.commandPrompt)
      this.log = this.log.replace(/.*>.*\n/g, "");
  },
  
  highlight: function() {
    this.log = this.log.replace(/(\[[A-Za-z'\-, ]+\])\n(.*)(\nAlso (here|in the room): .*)?(\nObvious exits: .*)?/g,"<div class=\"room\"><div class=\"location\">$1</div><div class=\"description\">$2</div><div class=\"alsohere\">$3</div><div class=\"obviousexits\">$5</div></div>");
    this.log = this.log.replace(DRLogPrettifier.options.highlight.speech.pattern, "<span class=\"speech\">$&</span>");
    this.log = this.log.replace(DRLogPrettifier.options.highlight.gweth.pattern, "<span class=\"gweth\">$&</span>");
  },
  
  output: function() {
    document.getElementsByTagName("body")[0].innerHTML+="<pre>"+this.log+"</pre>";
  },
  
  
  assemble: function() {
    document.getElementsByTagName("body")[0].innerHTML+="\
      <textarea id=\"logcontent\" rows=\"10\" cols=\"60\"></textarea>\
      <input type=\"button\" onclick=\"new DRLogPrettifier().process();\" />\
    ";
  }
};