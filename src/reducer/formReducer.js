import { combineForms } from "react-redux-form";

export const FormReducer = combineForms(
  {
    addStoryForm: {},
    aiAdminFilterForm: {
      sortDescending: false,
      radioSelection: "stageall"
    },
    dealCardForm: {},
    login: { username: "", password: "" },
    newDealCardForm: {},
    playbook: {
      id: -1,
      name: "",
      description: "",
      playbook_tag: [],
      switch: false
    },
    playbookClone: {},
    userDetails: {},
    accountDetails: {},
    playbookBoardAdvancedSearch: {},
    playbookCardForm: {},
    playbookCardTargetForm: {},
    playbooks: { id: -1, name: "", description: "" },
    sourceCardForm: {},
    targetCardForm: {},
    playbookBoard: -1,
    storyFilterForm: {},
    updateStoryNameForm: {},
    updateStoryOpptyForm: {},
    play: -1,
    notesForm: {
      all: { formattedText: "", tags: {} },
      formattedStrings: {},
      tags: {},
      selectedTopic: {}
    },
    opptyPlanForm: {
      screenState: "Why Buy, Why Now",
      callPlanCardSort: { value: "Most Relevant", label: "Most Relevant" },
      notesFieldFilter: { label: "All", value: "all" }
    },
    opptyPlanInfoForm: {},
    addOpptyPlanForm: {},
    opptyAddContactForm: {},
    addOpptyPlanCardForm: {},
    convoPlannerForm: {},
    convoPlannerFilterForm: {},
    storyOpptyDetailsForm: {},
    transcriptForm: {
      selectedTopic: {
        label: "Economic Drivers (0)",
        value: "economic-drivers"
      }
    },
    gongCallForm: {
      all: { formattedText: "", tags: {} },
      formattedStrings: {},
      tags: {},
      selectedTopic: {},
      currentSelectedCard: {}
    },
    gongEmailForm: {
      all: { formattedText: "", tags: {} },
      formattedStrings: {},
      tags: {},
      selectedTopic: {},
      currentSelectedCard: {}
    },

    // form reducers for new design
    selectedPlaybook: {
      id: -1,
      name: ""
    },
    storyListFilters: {
      fiscalQr: "",
      fiscalYear: "",
      myFilterEnabled: "",
      storyStatus: "",
      userId: "",
      industries: [],
      products: [],
      markets: [],
      regions: []
    },
    cardInsights: {
      protip: "",
      description: "",
      cardDetails: {
        File: "",
        url: "",
        product: [],
        compelling_event: "N",
        criterion: "N"
      }
    },
    optyCardInsights: {
      protip: "",
      context: "",
      talkingPoints: "",
      cardDetails: {
        File: "",
        url: "",
        product: []
      },
      compellingEvent: false,
      decisionCriteria: true
    },
    storyCardInsights: {
      protip: "",
      context: "",
      talkingPoints: "",
      cardDetails: {
        File: "",
        url: "",
        product: []
      },
      compellingEvent: false,
      decisionCriteria: true
    },
    storyBoardV2Form: {},
    addCardInsights: {},
    contactDetails: {
      firstName: "",
      lastName: "",
      jobTitle: "",
      email: "",
      role: ""
    },
    opptyContactDetails: {
      department: "",
      email: "",
      id: "",
      jobTitleName: "",
      mobile: "",
      name: "",
      phone: "",
      roleOfContact: "",
      source: "",
      status: "",
      statusReason: "",
      lastContacted: "",
      role: "",
      sentiment: ""
    },
    cardOverview: {
      description: "",
      talkingPoints: "",
      cardDetails: {
        File: [],
        url: [],
        productBeans: [],
        playbook_tag: [],
        tagBean: []
      }
    },
    searchStoriesFilters: {
      ecoBuyer: "",
      accNameList: [""],
      convEnvList: [""],
      custEnvList: [""],
      industryList: [""],
      marketList: [""],
      productList: [""],
      regionList: [""],
      matchLevel: "partial",
      pBCardId: 0,
      pinnedCardId: 0,
      storyId: 0,
      searchString: "",
      sortOrder: "",
      stageName: "",
      topicName: ""
    },
    salesPlay: {},
    custEnviroment: {
      custEnvironmentList: {},
      custFilters: []
    },
    preOptyForm: {
      description: "",
      reason: "",
      status: "",
      type: "",
      originalValues: {}
    },
    opptyPlanTitle: {
      type: "",
      buisness: ""
    },
    optycardForm: {
      callPlan: false,
      customerVerify: false,
      description: "",
      name: "",
      topicName: "Economic Drivers",
      file: null,
      urlAttachment: "",
      decisionCriteria: false,
      compellingEvent: false,
      productList: []
    },
    opptyPlanScreenForm: {
      opptyPlanCardSearchString: "",
      pinnedCardId: null,
      filterType: "default"
    },
    personaContactSearch: {
      contactSearchString: ""
    },
    editInsightsTab: {
      isEdit: false
    },
    conversationPlannerFilters: {
      selectedPlaybook: {
        id: 0,
        name: "",
        status: ""
      },
      selectedAccount: {
        orgId: 0,
        name: "",
        id: 0,
        icon: "",
        region: {},
        industry: {},
        marketSegment: {}
      }
    },
    handleTabSelection: {
      defaultModalTabs: ""
    },
    contactDropdown: {},
    personaDropdown: {},
    ratingQuestions: [],
    salesPlayForm: {
      playbookSalesPlayId: null,
      playbookId: null,
      name: "",
      description: "",
      type: null,
      subtype: null,
      status: null,
      rank: null,
      hookText: null,
      currentSalesPlay: null
    },
    storiesTabFilterForm: {
      status: { label: "Status: Won", value: "closed-won" },
      share: {
        label: "External",
        value: "share-external-complete",
        icon: "public"
      },
      custEnvs: []
    },
    playbookStoriesTabFilterForm: {
      status: { label: "Status: Won", value: "closed-won" },
      share: {
        label: "External",
        value: "share-external-complete",
        icon: "public"
      },
      searchKeyword: ""
    },
    addPlaybookCardFormV2: {
      cardTitle: "",
      description: "",
      talkingPoints: "",
      ecoDriverType: "KPI",
      hookRank: "",
      jobTitles: [],
      products: [],
      productType: {
        value: "internal",
        label: "Internal"
      },
      salesStage: {
        value: "prospecting",
        label: "Prospecting"
      },
      external: true,
      File: [],
      url: []
    },
    tearsheetUpdateForm: {
      challenge: "",
      solution: "",
      impact: "",
      conclusion: ""
    },
    overallAssessmentSummaryForm: {
      comment1: "",
      comment2: "",
      comment3: "",
      finalRatingopeningthecall: 0,
      finalRatingwhyanythingwhynow: 0,
      finalRatingObjectionHandling: 0,
      finalRatingOverall: 0,
      finalRatingwhyus: 0,
      finalRatingproofpointdelivery: 0,
      doingWellForComp1: "",
      doingWellForComp2: "",
      doingWellForComp3: "",
      doingWellForComp4: "",
      doingWellForComp5: "",
      recForComp1: "",
      recForComp2: "",
      recForComp3: "",
      recForComp4: "",
      recForComp5: "",
      subtype: null,
      type: null
    },
    playbookAnalyticsData: {
      cards: [],
      selectedCard: null
    },
    personas: [],
    selectedPersonas: [],
  },
  "form"
);
