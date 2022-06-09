import { OpptyPlanCardModel } from "../../../../model/opptyPlanModels/OpptyPlanCardModel";
import { OptyPlanModel, OptyPersonaModel } from "../../../../model/opptyPlanModels/OpptyPlanModels";

// Pushing updated card to redux (for modal)
export const pushCardToRedux = (card) => {
    delete card.updateVerifyStatus;
    OpptyPlanCardModel.updateCardDetails({
        ...card,
        confByCustomer: card.confByCustomer,
        enableVerifyActionForUser: card.enableVerifyActionForUser,
        verifyCount: card.verifyCount
    });
    OptyPlanModel.updateCardDetail({
        ...card,
        confByCustomer: card.confByCustomer,
        enableVerifyActionForUser: card.enableVerifyActionForUser,
        verifyCount: card.verifyCount
    });
    OptyPersonaModel.updateCardDetail(card.id, {
        ...card,
        confByCustomer: card.confByCustomer,
        enableVerifyActionForUser: card.enableVerifyActionForUser,
        verifyCount: card.verifyCount
    });
};
