export default function AboutPage() {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">
          Who the fuc* are these guys?
        </h1>
        <ol className="list-decimal list-inside mb-12 space-y-2">
          <li>We are a student team from Gimbalabs</li>
          <li>This is a learn, build, earn project funded by Gimbalabs and Project Catalyst</li>
          <li>Join us at Gimbalabs to see how you can participate</li>
        </ol>
  
        <div className="flex justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">Team</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>Teamasar</li>
              <li>gZero</li>
              <li>Newman5</li>
              <li>NatureDopes</li>
            </ol>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">Mentors</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>jamesdunseith</li>
              <li>Adrian</li>
              <li>Prof.Mix</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
  