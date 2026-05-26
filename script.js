function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

let latestPlainText = "";

function generatePlan() {
  const feature = document.getElementById("feature").value.trim();
  const goal = document.getElementById("goal").value;

  let segment = document.getElementById("segment").value;
  let experimentType = document.getElementById("experimentType").value;
  let risk = document.getElementById("risk").value;
  let confidence = document.getElementById("confidence").value;
  let baseline = document.getElementById("baseline").value.trim();
  let lift = document.getElementById("lift").value.trim();

  const output = document.getElementById("output");

  if (!feature || !goal) {
    output.className = "output-placeholder";
    output.innerHTML =
      "Please enter a feature / initiative and select a primary goal.";
    return;
  }

  if (!segment) {
    const segmentDefaults = {
      "User Activation": "New Users",
      "Retention": "At-Risk Users",
      "Conversion": "Free Users",
      "Revenue Growth": "Premium Users",
      "Feature Adoption": "Power Users",
      "User Engagement": "Active Users"
    };

    segment = segmentDefaults[goal];
  }

  if (!experimentType) {
    const experimentDefaults = {
      "User Activation": "Onboarding Experiment",
      "Retention": "Feature Rollout",
      "Conversion": "A/B Test",
      "Revenue Growth": "Pricing Experiment",
      "Feature Adoption": "Multivariate Test",
      "User Engagement": "A/B Test"
    };

    experimentType = experimentDefaults[goal];
  }

  if (!risk) risk = "Medium";
  if (!confidence) confidence = "Medium";

  if (!baseline) {
    const baselineDefaults = {
      "User Activation": "Estimated activation rate: 32–40%",
      "Retention": "Estimated Day-30 retention: 18–25%",
      "Conversion": "Estimated conversion rate: 3–6%",
      "Revenue Growth": "Estimated ARPU growth baseline: 4–7%",
      "Feature Adoption": "Estimated feature adoption rate: 22–35%",
      "User Engagement": "Estimated engagement frequency: 2.1 sessions/week"
    };

    baseline = baselineDefaults[goal];
  }

  if (!lift) {
    const liftDefaults = {
      "User Activation": "Target improvement: +8–12% activation",
      "Retention": "Target improvement: +5–8% retention",
      "Conversion": "Target improvement: +10–15% conversion",
      "Revenue Growth": "Target improvement: +6–10% revenue per user",
      "Feature Adoption": "Target improvement: +15–20% adoption",
      "User Engagement": "Target improvement: +12–18% engagement"
    };

    lift = liftDefaults[goal];
  }

  const hypotheses = {
    "User Activation":
      `If we improve ${feature}, ${segment.toLowerCase()} will reach value faster, increasing activation from the current baseline.`,

    "Retention":
      `If we improve ${feature}, ${segment.toLowerCase()} will have more reasons to return, improving retention over time.`,

    "Conversion":
      `If we optimize ${feature}, ${segment.toLowerCase()} will experience less friction and convert at a higher rate.`,

    "Revenue Growth":
      `If we improve ${feature}, ${segment.toLowerCase()} will generate higher monetization or expansion potential.`,

    "Feature Adoption":
      `If we redesign ${feature}, ${segment.toLowerCase()} will discover and repeatedly use the feature more often.`,

    "User Engagement":
      `If we improve ${feature}, ${segment.toLowerCase()} will interact more frequently and deeply with the product.`
  };

  const primaryMetrics = {
    "User Activation": [
      "Activation rate",
      "Onboarding completion rate",
      "Time-to-value"
    ],

    "Retention": [
      "Day 7 retention",
      "Day 30 retention",
      "Returning user rate"
    ],

    "Conversion": [
      "Conversion rate",
      "Checkout completion rate",
      "Trial-to-paid conversion"
    ],

    "Revenue Growth": [
      "Revenue per user",
      "ARPU",
      "Expansion revenue"
    ],

    "Feature Adoption": [
      "Feature adoption rate",
      "Repeat usage rate",
      "Active feature users"
    ],

    "User Engagement": [
      "Session length",
      "DAU/WAU ratio",
      "Engagement frequency"
    ]
  };

  const guardrailMetrics = {
    Low: [
      "Error rate",
      "Support tickets",
      "Page load speed"
    ],

    Medium: [
      "Customer satisfaction",
      "Churn risk",
      "Engagement drop-off"
    ],

    High: [
      "Revenue impact",
      "Customer trust",
      "Operational failures"
    ]
  };

  const rolloutPlans = {
    Low:
      "Start with a 20% rollout, monitor for one week, then scale gradually if guardrails remain stable.",

    Medium:
      "Launch to a limited cohort first, validate success and guardrail metrics, then expand in phased increments.",

    High:
      "Run a controlled beta with close monitoring, create a rollback plan, and require leadership review before broader launch."
  };

  const confidenceAdvice = {
    Low:
      "Confidence is low, so treat this as a learning experiment. Prioritize qualitative feedback, instrumentation quality, and small-cohort testing before scaling.",

    Medium:
      "Confidence is moderate. Run the test with clear success criteria and monitor both primary and guardrail metrics before expanding.",

    High:
      "Confidence is high. The team can move faster, but should still validate assumptions and watch for unintended downstream impacts."
  };

  const decisionRules = {
    Low:
      "Ship if the primary metric improves and no major guardrail metrics worsen.",

    Medium:
      "Ship only if the expected lift is directionally achieved and guardrails remain stable.",

    High:
      "Do not fully ship unless the expected lift is clearly achieved and confidence is strong."
  };

  const tradeoffs = {
    "A/B Test":
      "Simple to analyze and easy to explain, but may miss interactions across multiple variables.",

    "Multivariate Test":
      "Can reveal deeper insights, but requires larger sample sizes and longer timelines.",

    "Pricing Experiment":
      "Can produce strong revenue insights, but carries customer trust and churn risk.",

    "Onboarding Experiment":
      "Can strongly improve activation, but long-term retention impact may take longer to validate.",

    "Feature Rollout":
      "Reduces operational risk, but may slow experimentation velocity."
  };

  const leadershipQuestions = [
    "Why is this the right experiment to run now?",
    "What is the expected business upside?",
    "What happens if the primary metric improves but guardrails worsen?",
    "How confident are we in attribution?",
    "What is the rollback plan?"
  ];

  const qualityScore = calculateQualityScore({
    confidence,
    risk,
    baseline,
    lift
  });

  const qualityLabel =
    qualityScore >= 80
      ? "Strong experiment candidate"
      : qualityScore >= 60
      ? "Promising, but needs tighter validation"
      : "Needs sharper hypothesis";

  const executiveSummary =
    `This is a ${risk.toLowerCase()}-risk ${experimentType.toLowerCase()} targeting ${segment.toLowerCase()} with the goal of improving ${goal.toLowerCase()}.`;

  output.className = "output-grid";

  output.innerHTML = `
    <div class="result-card highlight-card">
      <h2>Executive Summary</h2>
      <p>${executiveSummary}</p>
    </div>

    <div class="result-card success-card">
      <h2>Experiment Quality Score</h2>
      <p><strong>${qualityScore}/100 — ${qualityLabel}</strong></p>

      <div class="score-bar">
        <div class="score-fill" style="width: ${qualityScore}%"></div>
      </div>
    </div>

    <div class="result-card highlight-card">
      <h2>Experiment Summary</h2>

      <p>
        <span class="badge">${experimentType}</span>
        <span class="badge">${goal}</span>
        <span class="badge">${segment}</span>
        <span class="badge">${risk} Risk</span>
      </p>

      <p><strong>Feature:</strong> ${feature}</p>

      <p><strong>Hypothesis:</strong> ${hypotheses[goal]}</p>
    </div>

    <div class="metrics-row">
      <div class="metric-box">
        <span>Current Performance</span>
        <strong>${baseline}</strong>
      </div>

      <div class="metric-box">
        <span>Target Outcome</span>
        <strong>${lift}</strong>
      </div>

      <div class="metric-box">
        <span>Confidence</span>
        <strong>${confidence}</strong>
      </div>

      <div class="metric-box">
        <span>Risk</span>
        <strong>${risk}</strong>
      </div>
    </div>

    <div class="result-card success-card">
      <h2>Primary Success Metrics</h2>

      <ul>
        ${primaryMetrics[goal].map(metric => `<li>${metric}</li>`).join("")}
      </ul>
    </div>

    <div class="result-card warning-card">
      <h2>Guardrail Metrics</h2>

      <ul>
        ${guardrailMetrics[risk].map(metric => `<li>${metric}</li>`).join("")}
      </ul>
    </div>

    <div class="result-card highlight-card">
      <h2>Experiment Timeline</h2>

      <div class="timeline">
        <div class="timeline-step">
          <strong>Week 1 — Instrumentation</strong>
          Define metrics and establish baseline.
        </div>

        <div class="timeline-step">
          <strong>Week 2 — Controlled Launch</strong>
          Launch to a small cohort and monitor.
        </div>

        <div class="timeline-step">
          <strong>Week 3 — Analysis</strong>
          Compare control vs treatment.
        </div>

        <div class="timeline-step">
          <strong>Week 4 — Decision</strong>
          Scale, iterate, or rollback.
        </div>
      </div>
    </div>

    <div class="result-card success-card">
      <h2>Experiment Design</h2>

      <ul>
        <li>Define control and treatment groups.</li>
        <li>Confirm baseline measurement before launch.</li>
        <li>Run for statistically meaningful duration.</li>
        <li>Monitor primary and guardrail metrics continuously.</li>
      </ul>
    </div>

    <div class="result-card highlight-card">
      <h2>Rollout Plan</h2>

      <p>${rolloutPlans[risk]}</p>
    </div>

    <div class="result-card success-card">
      <h2>Confidence Guidance</h2>

      <p>${confidenceAdvice[confidence]}</p>
    </div>

    <div class="result-card warning-card">
      <h2>Decision Rule</h2>

      <p>${decisionRules[risk]}</p>
    </div>

    <div class="result-card risk-card">
      <h2>Launch Recommendation</h2>

      <p>${getDecisionRecommendation(risk, confidence)}</p>
    </div>

    <div class="result-card risk-card">
      <h2>Tradeoffs</h2>

      <p>${tradeoffs[experimentType]}</p>
    </div>

    <div class="result-card warning-card">
      <h2>What Leadership Will Ask</h2>

      <ul>
        ${leadershipQuestions.map(q => `<li>${q}</li>`).join("")}
      </ul>
    </div>

    <div class="result-card risk-card">
      <h2>Potential Risks</h2>

      <ul>
        <li>Users may not notice the change enough to alter behavior.</li>
        <li>Short-term gains may not translate into long-term retention.</li>
        <li>Operational complexity may slow rollout speed.</li>
      </ul>
    </div>

    <div class="result-card success-card">
      <h2>Recommended PM Thinking</h2>

      <ul>
        <li>Prioritize learning speed over feature complexity.</li>
        <li>Keep the treatment focused so results are easier to interpret.</li>
        <li>Validate user behavior with qualitative interviews.</li>
      </ul>
    </div>

    <div class="result-card warning-card">
        <h2>Assumptions Used</h2>

        <ul>
            <li>User segment was recommended based on the selected primary goal.</li>
            <li>Experiment type was selected based on the goal and expected user behavior change.</li>
            <li>Risk and confidence default to Medium if not selected.</li>
            <li>Current performance and target outcome are auto-estimated when left blank.</li>
            <li>Recommendations are directional and should be validated with real product data.</li>
        </ul>
    </div>
    
    <div class="result-card highlight-card">
      <h2>Follow-Up Questions</h2>

      <ul>
        <li>What user behavior are we trying to change?</li>
        <li>What would make this experiment fail?</li>
        <li>What tradeoff exists between speed and confidence?</li>
        <li>How would we scale if results are positive?</li>
      </ul>
    </div>
  `;
}

function calculateQualityScore(data) {
  let score = 65;

  if (data.confidence === "High") score += 15;
  if (data.confidence === "Medium") score += 8;
  if (data.confidence === "Low") score -= 10;

  if (data.risk === "Low") score += 10;
  if (data.risk === "High") score -= 8;

  if (data.baseline) score += 5;
  if (data.lift) score += 5;

  return Math.max(35, Math.min(100, score));
}

function getDecisionRecommendation(risk, confidence) {
  if (risk === "Low" && confidence === "High") {
    return "Strong candidate to test and potentially ship quickly.";
  }

  if (risk === "High" && confidence === "Low") {
    return "Run a narrow beta before broader rollout.";
  }

  return "Good candidate for a phased experiment. Validate expected lift before expanding.";
}

function copyOutput() {
  const output = document.getElementById("output");

  if (!output.innerText.trim()) {
    alert("Generate an experiment plan first.");
    return;
  }

  navigator.clipboard.writeText(output.innerText);

  alert("Copied to clipboard.");
}

function downloadText() {
  const output = document.getElementById("output");

  if (!output.innerText.trim()) {
    alert("Generate an experiment plan first.");
    return;
  }

  const blob = new Blob([output.innerText], {
    type: "text/plain"
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = "experiment-plan.txt";

  link.click();
}

document.querySelectorAll("select, input").forEach((field) => {
  field.addEventListener("change", () => {
    if (field.value) {
      field.classList.add("valid");
    } else {
      field.classList.remove("valid");
    }
  });

  field.addEventListener("input", () => {
    if (field.value) {
      field.classList.add("valid");
    } else {
      field.classList.remove("valid");
    }
  });
});