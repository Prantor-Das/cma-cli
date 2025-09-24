import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Code2, Heart, Users, Zap } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

interface Value {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const team: TeamMember[] = [
  {
    name: "Development Team",
    role: "Full Stack Developers",
    description: "Passionate developers building modern web applications"
  },
  {
    name: "Design Team",
    role: "UI/UX Designers",
    description: "Creating beautiful and intuitive user experiences"
  }
];

const values: Value[] = [
  {
    icon: Code2,
    title: "Modern Technology",
    description: "We use cutting-edge technologies to build scalable applications"
  },
  {
    icon: Zap,
    title: "Performance First",
    description: "Optimized for speed and efficiency in every aspect"
  },
  {
    icon: Users,
    title: "User Focused",
    description: "Every decision is made with the end user in mind"
  },
  {
    icon: Heart,
    title: "Open Source",
    description: "Contributing to the community and sharing knowledge"
  }
];

const technologies = ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Vite", "TypeScript", "Vitest"];

export default function About() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Our Project
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A modern MERN stack starter template designed to help developers build 
            amazing full-stack applications quickly and efficiently.
          </p>
        </div>

        {/* Mission */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>
              Empowering developers with modern tools and best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We believe that building web applications should be enjoyable and efficient. 
              This starter template combines the power of MongoDB, Express.js, React, and Node.js 
              with modern development practices, beautiful UI components, and comprehensive tooling 
              to help you focus on what matters most - building great features for your users.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <value.icon className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
            <CardDescription>
              Built with modern, battle-tested technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {technologies.map((tech) => (
                <div key={tech} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{tech}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
