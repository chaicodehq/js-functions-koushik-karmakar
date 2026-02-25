/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call 
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
//  */ {
  // { id, name, party }
}
export function createElection(candidates) {
  // Your code here
  const registerVoterId = new Set();
  const votedVoters = new Set();
  const votes = [];
  //  - voter: { id, name, age }
  function registerVoter(voter) {
    if (!voter || typeof voter !== "object") return false;
    const { id, name, age } = voter;
    if (!id || !name || typeof age !== "number") return false;
    if (age < 18) return false;
    if (registerVoterId.has(id)) return false;
    registerVoterId.add(id);
    return true;
  }

  function castVote(voterId, candidateId, onSuccess, onError) {
    if (!registerVoterId.has(voterId)) {
      return onError("Voter is not registered");
    }
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) {
      return onError("Candidate does not exist");
    }
    if (votedVoters.has(voterId)) {
      return onError("Voter has already voted");
    }
    votedVoters.add(voterId);
    votes.push({ voterId, candidateId });
    return onSuccess({ voterId, candidateId });
  }

  function getResults(sortFn) {
    const voteCountMap = new Map();

    for (const vote of votes) {
      voteCountMap.set(
        vote.candidateId,
        (voteCountMap.get(vote.candidateId) || 0) + 1,
      );
    }

    const results = candidates.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      party: candidate.party,
      votes: voteCountMap.get(candidate.id) || 0,
    }));

    if (typeof sortFn === "function") {
      return results.sort(sortFn);
    }

    return results.sort((a, b) => b.votes - a.votes);
  }

  function getWinner() {
    if (!votes || votes.length === 0) {
      return null;
    }

    const count = {};

    for (const { candidateId } of votes) {
      count[candidateId] = (count[candidateId] || 0) + 1;
    }

    let maxVotes = -1;
    let topCandidateId = null;

    for (const candidateId in count) {
      if (count[candidateId] > maxVotes) {
        maxVotes = count[candidateId];
        topCandidateId = candidateId;
      }
    }

    return candidates.find((item) => item.id === topCandidateId) || null;
  }

  return { registerVoter, castVote, getResults, getWinner };
}
// { minAge: 18, requiredFields: ["id", "name", "age"] }   ||  { valid, reason }
export function createVoteValidator(rules) {
  return function (voter) {
    if (!voter || typeof voter !== "object") {
      return { valid: false, reason: "Invalid voter object" };
    }

    for (const field of rules.requiredFields) {
      if (!(field in voter)) {
        return { valid: false, reason: `Missing field: ${field}` };
      }
    }

    if (typeof voter.age !== "number" || voter.age < rules.minAge) {
      return { valid: false, reason: "Voter under min age" };
    }

    return { valid: true };
  };
}
//  { name, votes: number, subRegions: [...] }
export function countVotesInRegions(regionTree) {
  if (regionTree === null || !regionTree) return 0;

  function addVote(region) {
    if (!region) return 0;
    let totalVote = region.votes || 0;
    for (const sub of region.subRegions || []) {
      totalVote += addVote(sub);
    }
    return totalVote;
  }
  return addVote(regionTree);
}
//  { "cand1": 5, "cand2": 3, ... }
export function tallyPure(currentTally, candidateId) {
  // Your code herer
  return {
    ...currentTally,
    [candidateId]: (currentTally[candidateId] || 0) + 1,
  };
}
