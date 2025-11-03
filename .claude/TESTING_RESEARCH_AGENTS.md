# Testing Online Research Agents

**Version**: 1.0
**Last Updated**: 2025-11-02
**Purpose**: Testing procedures for research-coordinator, academic-researcher, and industry-researcher agents

## Overview

The online research agent system consists of three agents:
- **research-coordinator** (Teal): Main coordinator that analyzes queries and spawns sub-agents
- **academic-researcher** (Orange): Sub-agent for academic literature and peer-reviewed research
- **industry-researcher** (Cyan): Sub-agent for industry practices and expert insights

## Prerequisites

### 1. Agent Installation

Ensure all three agents are installed:
```bash
ls -la .claude/agents/research-coordinator.md
ls -la .claude/agents/academic-researcher.md
ls -la .claude/agents/industry-researcher.md
```

All three files should exist.

### 2. Directory Structure

Ensure research directory exists:
```bash
mkdir -p thoughts/research
```

### 3. Agent Discovery

**IMPORTANT**: After adding or modifying agent files, you must **restart Claude Code** for the agents to be discovered.

To verify agents are available:
- The research-coordinator agent should appear in the available agents list
- The sub-agents (academic-researcher, industry-researcher) are typically not directly invokable by users

## Test Cases

### Test 1: Basic Coordinator Function (Quick Research)

**Purpose**: Verify the coordinator can handle simple queries without spawning sub-agents.

**Test Query**:
```
Research the difference between REST and GraphQL APIs. This should be a quick overview.
```

**Expected Behavior**:
- Coordinator performs direct research (no sub-agents needed)
- Produces document in `thoughts/research/YYYY-MM-DD-*.md`
- Quick depth (~5-10 sources)
- Document has basic structure: Executive Summary, findings, recommendations

**Success Criteria**:
- ✅ Document created within reasonable time
- ✅ Quality sources cited
- ✅ Clear recommendations
- ✅ Proper frontmatter with metadata

### Test 2: Industry-Only Research (Medium Depth)

**Purpose**: Verify coordinator can spawn industry-researcher sub-agent.

**Test Query**:
```
Research best practices for mobile-first UI design from major tech companies.
Find expert opinions and case studies from companies like Airbnb, Instagram, and Uber.
```

**Expected Behavior**:
- Coordinator identifies this as industry-heavy query
- May spawn industry-researcher sub-agent
- Medium depth (~15-25 sources)
- Focus on expert insights and case studies

**Success Criteria**:
- ✅ Document has "Industry Insights" section
- ✅ Expert opinions cited with credentials
- ✅ Case studies with real examples
- ✅ Source credibility assessment

**Verification**:
```bash
# Check document was created
ls -la thoughts/research/

# Verify structure includes industry section
grep "^## Industry" thoughts/research/2025-11-02-*.md
```

### Test 3: Academic-Only Research (Medium+ Depth)

**Purpose**: Verify coordinator can spawn academic-researcher sub-agent.

**Test Query**:
```
Research cognitive load theory and its implications for user interface design.
I need the academic foundations and empirical studies.
```

**Expected Behavior**:
- Coordinator identifies this as academic-heavy query
- Should spawn academic-researcher sub-agent
- Medium to Deep depth (academic defaults to minimum Medium)
- Focus on peer-reviewed research and methodology

**Success Criteria**:
- ✅ Document has "Academic Findings" section
- ✅ Peer-reviewed papers cited with full citations
- ✅ Methodology quality assessment
- ✅ Citation network analysis
- ✅ Academic consensus identified

**Verification**:
```bash
# Verify structure includes academic section
grep "^## Academic" thoughts/research/2025-11-02-*.md

# Check for citation quality
grep -A 5 "peer-reviewed\|citation\|methodology" thoughts/research/2025-11-02-*.md
```

### Test 4: Hybrid Research (Both Sub-Agents)

**Purpose**: Verify coordinator can spawn BOTH sub-agents in parallel for complex queries.

**Test Query**:
```
Research vector similarity algorithms for content recommendation systems.
Consider both the theoretical foundations from academic research and
real-world implementations at scale from industry. I want to understand:

1. What are the main vector similarity approaches and their trade-offs?
2. How do companies like Netflix, Spotify implement vector-based recommendations?
3. What are the performance considerations at scale?
4. What are current best practices?
```

**Expected Behavior**:
- Coordinator identifies need for both academic AND industry research
- Spawns BOTH sub-agents in parallel
- Deep depth (~30+ sources total)
- Cross-validation between academic theory and industry practice

**Success Criteria**:
- ✅ Document has BOTH "Academic Findings" AND "Industry Insights" sections
- ✅ Academic section: Papers, methodology, theoretical foundations
- ✅ Industry section: Company implementations, metrics, case studies
- ✅ "Critical Analysis" section that cross-validates findings
- ✅ Confidence levels with rationale
- ✅ Synthesized recommendations combining both sources

**Verification**:
```bash
# Check for both sections
grep "^## Academic Findings" thoughts/research/2025-11-02-*.md
grep "^## Industry Insights" thoughts/research/2025-11-02-*.md

# Check for cross-validation
grep -A 10 "^## Critical Analysis" thoughts/research/2025-11-02-*.md

# Verify source count
grep "Sources Reviewed:" thoughts/research/2025-11-02-*.md
```

### Test 5: Parallel with Codebase Research

**Purpose**: Verify research-coordinator can run in parallel with codebase-researcher.

**Test Query**:
```
Investigate rate limiting best practices and compare them to our current implementation.
```

**Expected Behavior**:
- User or system spawns TWO agents in parallel:
  - codebase-researcher: Analyzes internal implementation
  - research-coordinator: Researches external best practices
- Both complete independently
- Human synthesizes or asks for comparison

**Success Criteria**:
- ✅ Two separate research documents created
- ✅ One about external best practices
- ✅ One about internal implementation
- ✅ Both complete without conflicts

**Verification**:
```bash
# Check for multiple research documents
ls -lt thoughts/research/ | head -5

# Verify both types of research
grep "research_type:\|doc_type:" thoughts/research/2025-11-02-*.md
```

## Verification Checklist

After each test, verify the following:

### Document Quality
- [ ] Proper YAML frontmatter at top of file
- [ ] `doc_type: research` is set
- [ ] Research question is clearly stated
- [ ] Research strategy explains approach
- [ ] Sources are cited with quality assessment
- [ ] Confidence levels are provided with rationale
- [ ] Bibliography/sources list is complete

### Content Structure
- [ ] Executive Summary synthesizes key findings
- [ ] Academic Findings (if applicable) with citations
- [ ] Industry Insights (if applicable) with case studies
- [ ] Critical Analysis cross-validates sources
- [ ] Contradictions are explained, not hidden
- [ ] Actionable recommendations provided
- [ ] Further research areas identified

### Metadata Verification
```bash
# Check frontmatter completeness
head -30 thoughts/research/2025-11-02-*.md

# Should have these fields:
# - doc_type: research
# - date: (ISO timestamp)
# - title: (descriptive title)
# - research_question: (original query)
# - tags: (relevant tags)
# - status: complete
```

### Source Quality
- [ ] Multiple independent sources (not just one blog post)
- [ ] Source credibility is assessed
- [ ] Bias is identified and discussed
- [ ] Recent sources (for fast-moving fields)
- [ ] Mix of academic and industry (for hybrid queries)

### Critical Thinking
- [ ] Contradictions are identified and explained
- [ ] Context is provided (scale, domain, timeframe)
- [ ] Trade-offs are explicitly discussed
- [ ] Confidence levels match evidence strength
- [ ] Knowledge gaps are acknowledged

## Troubleshooting

### Issue: Agent Not Found

**Error**: `Agent type 'research-coordinator' not found`

**Solution**:
1. Verify agent file exists: `ls .claude/agents/research-coordinator.md`
2. **Restart Claude Code** to pick up new agents
3. Retry test

### Issue: Sub-Agents Not Spawning

**Symptoms**:
- No "Academic Findings" section despite academic query
- No "Industry Insights" section despite industry query
- System reminders show failed bash commands: `claude-agent academic-researcher ... (exit code: 127)`

**Diagnosis**:
The coordinator is trying to use bash commands instead of the Task tool.

**Solution**:
1. Verify the research-coordinator.md has correct Task tool instructions (should be fixed as of 2025-11-02)
2. Coordinator should use Task tool with subagent_type parameter
3. Check Step 3 in research-coordinator.md for proper Task tool usage

### Issue: Poor Quality Output

**Symptoms**:
- Sparse citations
- No source quality assessment
- Missing critical analysis
- Low confidence without explanation

**Diagnosis**:
Coordinator may be taking shortcuts or depth assessment is incorrect.

**Solutions**:
1. Specify depth explicitly: "This requires deep research"
2. Ask for specific outputs: "Include methodology assessment"
3. Request revision: "Can you provide more academic sources?"

### Issue: Timeout or Slow Execution

**Symptoms**:
- Research takes very long to complete
- Agent seems stuck

**Possible Causes**:
1. Deep research on complex topics takes time (expected)
2. WebSearch/WebFetch may be slow
3. Spawning multiple sub-agents adds overhead

**Solutions**:
- For quick tests, use simpler queries or specify "quick depth"
- Deep research (30+ sources) can take several minutes
- Monitor system reminders for progress

## Performance Benchmarks

Expected execution times (approximate):

- **Quick research** (5-10 sources): 1-3 minutes
- **Medium research** (15-25 sources): 3-7 minutes
- **Deep research** (30+ sources): 7-15 minutes
- **Parallel sub-agents**: Add 2-5 minutes for coordination overhead

Document sizes:
- **Quick**: 10-20 KB
- **Medium**: 30-50 KB
- **Deep**: 50-70 KB

## Success Metrics

A successful test demonstrates:

1. **Functional**: Agent completes without errors
2. **Quality**: High-quality sources with proper assessment
3. **Structure**: Proper document structure with all sections
4. **Synthesis**: Insights are synthesized, not just aggregated
5. **Critical**: Contradictions identified, bias assessed, confidence justified
6. **Actionable**: Clear recommendations based on evidence

## Test Results Template

Use this template to record test results:

```markdown
## Test: [Test Name]
**Date**: YYYY-MM-DD
**Query**: [Test query used]
**Expected Depth**: [Quick/Medium/Deep]

### Results
- ✅/❌ Document created
- ✅/❌ Proper structure
- ✅/❌ Quality sources
- ✅/❌ Critical analysis
- ✅/❌ Actionable recommendations

### Document Path
`thoughts/research/YYYY-MM-DD-*.md`

### Execution Time
[Duration]

### Source Count
[Number] sources reviewed

### Notes
[Any observations, issues, or insights]
```

## Regression Testing

After modifying agents, run these regression tests:

1. **Quick test**: Mobile UI best practices (should be fast, industry-focused)
2. **Academic test**: Cognitive load theory (should spawn academic-researcher)
3. **Hybrid test**: Vector similarity algorithms (should spawn both sub-agents)

All three should complete successfully with appropriate depth and structure.

## Best Practices for Testing

1. **Use Realistic Queries**: Test with actual research questions you'd ask
2. **Vary Complexity**: Test quick, medium, and deep research
3. **Check Both Types**: Test academic-heavy and industry-heavy queries
4. **Verify Parallel Execution**: Confirm both sub-agents can run simultaneously
5. **Validate Output Quality**: Don't just check for completion, verify content quality
6. **Document Issues**: Record any problems for future debugging

## Future Enhancements

Potential improvements to testing:

- [ ] Automated test suite with expected outputs
- [ ] Performance benchmarking across query types
- [ ] Source quality scoring system
- [ ] Comparison of coordinator-only vs. sub-agent outputs
- [ ] Integration with CI/CD for agent changes

---

**Last Test Run**: [Update when you run tests]
**Test Status**: [Pass/Fail with details]
**Known Issues**: [List any current known problems]
