import type { NamingRules } from "../types/audit";

export const defaultNamingRules: NamingRules = {
  tagPattern: "^(GA4|GAds|Yahoo|Meta|LINE|Criteo|MS|HTML|UA|CV|EV|TAG)[_\\- ].+",
  triggerPattern: "^(PV|Click|Form|CV|EV|Timer|Scroll|History|TR)[_\\- ].+",
  variablePattern: "^(DLV|JS|Cookie|URL|Regex|Lookup|CONST|VAR)[_\\- ].+",
};
