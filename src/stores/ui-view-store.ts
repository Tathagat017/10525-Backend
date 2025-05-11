import { makeAutoObservable, runInAction } from "mobx";

export class UiViewStore {
  _isCreateHouseHoldModalOpen = false;
  _isCreateChoreModalOpen = false;
  _isCreateExpenseModalOpen = false;
  _isInviteMemberModalOpen = false;
  constructor() {
    makeAutoObservable(this);
  }

  get IsCreateHouseHoldModalOpen() {
    return this._isCreateHouseHoldModalOpen;
  }

  get IsCreateChoreModalOpen() {
    return this._isCreateChoreModalOpen;
  }

  get IsCreateExpenseModalOpen() {
    return this._isCreateExpenseModalOpen;
  }

  get IsInviteMemberModalOpen() {
    return this._isInviteMemberModalOpen;
  }

  toggleCreateHouseHoldModal(value: boolean) {
    runInAction(() => {
      this._isCreateHouseHoldModalOpen = value;
    });
  }

  toggleCreateChoreModal(value: boolean) {
    runInAction(() => {
      this._isCreateChoreModalOpen = value;
    });
  }

  toggleCreateExpenseModal(value: boolean) {
    runInAction(() => {
      this._isCreateExpenseModalOpen = value;
    });
  }

  toggleInviteMemberModal(value: boolean) {
    runInAction(() => {
      this._isInviteMemberModalOpen = value;
    });
  }

  clearStore() {
    this._isCreateHouseHoldModalOpen = false;
  }
}
