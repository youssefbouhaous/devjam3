import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { classroomApi } from '@/services/api';
import { ClassroomDTO } from '@/types/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Plus, BookOpen, Users, Box, ArrowRight, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<ClassroomDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        if (user?.teacherID) {
          const data = await classroomApi.getClassrooms(user.teacherID);
          setClassrooms(data);
        }
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [user]);

  const stats = [
    { label: 'Total Classes', value: classrooms.length, icon: BookOpen },
    { label: 'Students', value: '-', icon: Users },
    { label: 'AR Experiences', value: '-', icon: Box },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-10 flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-10 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || 'Teacher'}
            </p>
          </div>
          <Button asChild className="button-effect">
            <Link to="/classrooms/new">
              <Plus className="h-4 w-4 mr-2" />
              New Classroom
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Classrooms */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Classrooms</h2>
            <Button asChild variant="ghost" className="gap-1">
              <Link to="/classrooms">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          {classrooms.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <GraduationCap className="h-10 w-10 text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">No classrooms yet</CardTitle>
                <CardDescription className="mb-4">
                  Create your first classroom to get started with AR4Learn
                </CardDescription>
                <Button asChild>
                  <Link to="/classrooms/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Classroom
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classrooms.slice(0, 3).map((classroom) => (
                <Card key={classroom.classroomID} className="card-hover overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle>{classroom.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {classroom.description || 'No description provided'}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2 border-t flex justify-between">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/classrooms/${classroom.classroomID}`}>
                        Manage
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/classrooms/${classroom.classroomID}/experiences/new`}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add Experience
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
