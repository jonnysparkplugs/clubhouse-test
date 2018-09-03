const clubhouse = require('clubhouse-lib');
const fetch = require('node-fetch');
const loggingUtil = require('../util/logging-util');

const CLUBHOUSE_URL = 'https://api.clubhouse.io/api/beta/';
let clubhouseToken = null;

let isEnabled = false;
let clientApi = null;

const requestData = async (name, getFn) => {
  loggingUtil.logMessage(loggingUtil.LogLevels.info, `Clubhouse - fetching via clubhouse-lib ${name}`);
  const data = await getFn();
  if (data && Array.isArray(data)) {
    loggingUtil.logMessage(loggingUtil.LogLevels.info, `Clubhouse - fetched ${data.length} ${name}`);
  } else {
    loggingUtil.logMessage(loggingUtil.LogLevels.error, `Clubhouse - issue fetching ${name}`);
  }
  return data;
}

const getAllStories = async () => {
  if (isEnabled) {
    return await clientApi.listStories().catch(error => {
      loggingUtil.logMessage(loggingUtil.LogLevels.error, `Clubhouse - getAllStories failed`, { error }, { error });
    });
  }
}

const getAllUsers = async () => {
  if (isEnabled) {
    return await clientApi.listMembers().catch(error => {
      loggingUtil.logMessage(loggingUtil.LogLevels.error, `Clubhouse - getAllUsers failed`, { error }, { error });
    });
  }
}

const getAllEpics = async () => {
  if (isEnabled) {
    return await clientApi.listEpics().catch(error => {
      loggingUtil.logMessage(loggingUtil.LogLevels.error, `Clubhouse - getAllEpics failed`, { error }, { error });
    });
  }
}

const getAllLabels = async () => {
  if (isEnabled) {
    return await (await fetch(`${CLUBHOUSE_URL}labels?token=${clubhouseToken}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })).json().catch(error => {
      loggingUtil.logMessage(loggingUtil.LogLevels.error, `Clubhouse - getAllLabels failed`, { error }, { error });
    });
  }
}

const getAllMilestones = async () => {
  if (isEnabled) {
    return await (await fetch(`${CLUBHOUSE_URL}milestones?token=${clubhouseToken}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })).json().catch(error => {
      loggingUtil.logMessage(loggingUtil.LogLevels.error, `Clubhouse - getAllMilestones failed`, { error }, { error });
    });
  }
}

const getAllStoriesFeatures = async () => {
  if (isEnabled) {
    return await (await fetch(`${CLUBHOUSE_URL}stories/search?token=${clubhouseToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story_type: 'feature' })
    })).json().catch(error => {
      loggingUtil.logMessage(loggingUtil.LogLevels.error, `Clubhouse - getAllStoriesFeatures failed`, { error }, { error });
    });
  }
}

const getAllStoriesBugs = async () => {
  if (isEnabled) {
    return await (await fetch(`${CLUBHOUSE_URL}stories/search?token=${clubhouseToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story_type: 'bug' })
    })).json().catch(error => {
      loggingUtil.logMessage(loggingUtil.LogLevels.error, `Clubhouse - getAllStoriesFeatures failed`, { error }, { error });
    });
  }
}

const getAllStoriesChores = async () => {
  if (isEnabled) {
    return await (await fetch(`${CLUBHOUSE_URL}stories/search?token=${clubhouseToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story_type: 'chore' })
    })).json().catch(error => {
      loggingUtil.logMessage(loggingUtil.LogLevels.error, `Clubhouse - getAllStoriesFeatures failed`, { error }, { error });
    });
  }
}

const requestDataFromClubhouse = async () => {
  // this is how i have to get stories....
  loggingUtil.logMessage(loggingUtil.LogLevels.info, `Clubhouse - fetching stories via POST`);
  const storyFeatures = await getAllStoriesFeatures();
  const storyBugs = await getAllStoriesBugs();
  const storyChores = await getAllStoriesChores();
  const stories = [...storyFeatures, ...storyBugs, ...storyChores];
  const epics = requestData('epics', getAllEpics);
  const milestones = requestData('milestones', getAllMilestones);
  const labels = requestData('labels', getAllLabels);
  const users = requestData('users', getAllUsers);
  // this will fail :-()
  const storiesViaNode = requestData('stories', getAllStories);
  return {
    stories,
    epics,
    milestones,
    labels,
    users,
    storiesViaNode
  };
}

const init = (token) => {
  if (token) {
    clubhouseToken = token;
    isEnabled = true;
    clientApi = clubhouse.create(token);
    loggingUtil.logMessage(loggingUtil.LogLevels.info, `Clubhouse - token set`);
  }
};

module.exports = { init, requestDataFromClubhouse };
